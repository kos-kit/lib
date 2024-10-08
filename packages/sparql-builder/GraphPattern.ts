import * as rdfjs from "@rdfjs/types";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { PropertyPath } from "./PropertyPath.js";
import { ToWhereOptions } from "./ToWhereOptions.js";
import { termToString } from "./termToString.js";

export abstract class GraphPattern {
  readonly sortRank: number = 0;

  /**
   * Limit a graph pattern to certain scope, such as CONSTRUCT or WHERE.
   */
  scoped(...scopes: readonly ScopedGraphPattern.Scope[]): ScopedGraphPattern {
    return new ScopedGraphPattern(
      this,
      new Set<ScopedGraphPattern.Scope>(scopes),
    );
  }

  abstract toConstructIndentedStrings(
    indent: number,
  ): readonly IndentedString[];

  toConstructString(): string {
    return this.toConstructStrings().join("\n");
  }

  toConstructStrings(): readonly string[] {
    return this.toConstructIndentedStrings(0).map(IndentedString.toString);
  }

  abstract toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[];

  toWhereString(options?: ToWhereOptions): string {
    return this.toWhereStrings(options).join("\n");
  }

  toWhereStrings(options?: ToWhereOptions): readonly string[] {
    return this.toWhereIndentedStrings(0, options).map(IndentedString.toString);
  }
}

/**
 * Basic graph pattern: ?s ?p ?o
 *
 * https://www.w3.org/TR/sparql11-query/#BasicGraphPatterns
 */
export class BasicGraphPattern extends GraphPattern {
  constructor(
    readonly subject: BasicGraphPattern.Subject,
    readonly predicate: BasicGraphPattern.Predicate,
    readonly object: BasicGraphPattern.Object,
  ) {
    super();
  }

  static variable(value: string): BasicGraphPattern.Variable {
    return {
      termType: "Variable",
      value,
    };
  }

  override toConstructIndentedStrings(
    indent: number,
  ): readonly IndentedString[] {
    if (this.predicate.termType === "PropertyPath") {
      throw new RangeError(
        "property paths are not supported in CONSTRUCT strings",
      );
    }

    return [
      {
        indent,
        string: `${termToString(this.subject)} ${termToString(
          this.predicate,
        )} ${termToString(this.object)} .`,
      },
    ];
  }

  override toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    const whereIndentedStrings: IndentedString[] = [];

    whereIndentedStrings.push({
      indent,
      string: `${termToString(this.subject)} ${
        this.predicate.termType === "PropertyPath"
          ? PropertyPath.toWhereString(this.predicate.value)
          : termToString(this.predicate)
      } ${termToString(this.object)} .`,
    });

    if (
      options?.includeLanguageTags &&
      this.object.termType === "Variable" &&
      this.object.plainLiteral
    ) {
      const languageTagTests = [...options.includeLanguageTags].map(
        (includeLanguageTag) =>
          `LANG(?${this.object.value}) = "${includeLanguageTag}"`,
      );

      whereIndentedStrings.push({
        indent,
        string: `FILTER (!BOUND(?${
          this.object.value
        }) || ${languageTagTests.join(" || ")} )`,
      });
    }

    return whereIndentedStrings;
  }
}

export namespace BasicGraphPattern {
  // Omit .equals from RDF/JS types for easier construction.
  export type BlankNode = Omit<rdfjs.BlankNode, "equals">;
  export type Literal = Omit<rdfjs.Literal, "equals">;
  export type NamedNode = Omit<rdfjs.NamedNode, "equals">;

  export type Object =
    | BlankNode
    | Literal
    | NamedNode
    | (Variable & {
        plainLiteral?: boolean;
      });
  export type Predicate =
    | NamedNode
    | { termType: "PropertyPath"; value: PropertyPath }
    | Variable;
  export type Subject = BlankNode | NamedNode | Variable;
  export type Variable = Omit<rdfjs.Variable, "equals">;
}

/**
 * FILTER EXISTS { ?s ?p ?o }
 */
export class FilterExistsGraphPattern extends GraphPattern {
  override readonly sortRank: number = 1;

  constructor(readonly graphPattern: GraphPattern) {
    super();
  }

  override toConstructIndentedStrings(
    _indent: number,
  ): readonly IndentedString[] {
    return [];
  }

  override toWhereIndentedStrings(indent: number): readonly IndentedString[] {
    return [
      { string: "FILTER EXISTS {", indent },
      ...this.graphPattern.toWhereIndentedStrings(indent + TAB_SPACES),
      { string: "}", indent },
    ];
  }
}

/**
 * FILTER NOT EXISTS { ?s ?p ?o }
 */
export class FilterNotExistsGraphPattern extends GraphPattern {
  override readonly sortRank: number = 1;

  constructor(readonly graphPattern: GraphPattern) {
    super();
  }

  override toConstructIndentedStrings(
    _indent: number,
  ): readonly IndentedString[] {
    return [];
  }

  override toWhereIndentedStrings(indent: number): readonly IndentedString[] {
    return [
      { string: "FILTER NOT EXISTS {", indent },
      ...this.graphPattern.toWhereIndentedStrings(indent + TAB_SPACES),
      { string: "}", indent },
    ];
  }
}

/**
 *  { ?s1 ?p1 ?o1 . ?s2 ?p2 ?o2 . }
 *  https://www.w3.org/TR/sparql11-query/#GroupPatterns
 */
export class GroupGraphPattern extends GraphPattern {
  readonly graphPatterns: readonly GraphPattern[];

  constructor(...graphPatterns: readonly GraphPattern[]) {
    super();
    this.graphPatterns = graphPatterns;
  }

  override toConstructIndentedStrings(
    indent: number,
  ): readonly IndentedString[] {
    return this.graphPatterns.flatMap((graphPattern) =>
      graphPattern.toConstructIndentedStrings(indent),
    );
  }

  override toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    let whereIndentedStrings: IndentedString[] = [{ string: "{", indent }];
    for (const graphPattern of this.graphPatterns) {
      whereIndentedStrings = whereIndentedStrings.concat(
        graphPattern.toWhereIndentedStrings(indent + TAB_SPACES, options),
      );
    }
    whereIndentedStrings.push({ string: "}", indent });
    return whereIndentedStrings;
  }
}

/**
 * OPTIONAL { ?s ?p ?o }
 * https://www.w3.org/TR/sparql11-query/#OptionalMatching
 */
export class OptionalGraphPattern extends GraphPattern {
  override readonly sortRank: number = 1;

  constructor(readonly graphPattern: GraphPattern) {
    super();
  }

  override toConstructIndentedStrings(
    indent: number,
  ): readonly IndentedString[] {
    return this.graphPattern.toConstructIndentedStrings(indent);
  }

  override toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    return [
      { string: "OPTIONAL {", indent },
      ...this.graphPattern.toWhereIndentedStrings(indent + TAB_SPACES, options),
      { string: "}", indent },
    ];
  }
}

/**
 * A graph pattern that has limited scopes.
 */
export class ScopedGraphPattern extends GraphPattern {
  constructor(
    readonly graphPattern: GraphPattern,
    readonly scopes: Set<ScopedGraphPattern.Scope>,
  ) {
    super();
  }

  override toConstructIndentedStrings(
    indent: number,
  ): readonly IndentedString[] {
    return this.scopes.has("CONSTRUCT")
      ? this.graphPattern.toConstructIndentedStrings(indent)
      : [];
  }

  override toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    return this.scopes.has("WHERE")
      ? this.graphPattern.toWhereIndentedStrings(indent, options)
      : [];
  }
}

export namespace ScopedGraphPattern {
  export type Scope = "CONSTRUCT" | "WHERE";
}

/**
 *  { ?s1 ?p1 ?o1 } UNION { ?s2 ?p2 ?o2 . }
 *  https://www.w3.org/TR/sparql11-query/#alternatives
 */
export class UnionGraphPattern extends GraphPattern {
  readonly graphPatterns: readonly GraphPattern[];

  constructor(...graphPatterns: readonly GraphPattern[]) {
    super();
    this.graphPatterns = graphPatterns;
  }

  override toConstructIndentedStrings(
    indent: number,
  ): readonly IndentedString[] {
    return this.graphPatterns.flatMap((graphPattern) =>
      graphPattern.toConstructIndentedStrings(indent),
    );
  }

  override toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    let whereIndentedStrings: IndentedString[] = [];
    this.graphPatterns.forEach((graphPattern, graphPatternI) => {
      if (graphPatternI > 0) {
        whereIndentedStrings.push({ string: "UNION", indent });
      }
      whereIndentedStrings.push({ string: "{", indent });
      whereIndentedStrings = whereIndentedStrings.concat(
        graphPattern.toWhereIndentedStrings(indent + TAB_SPACES, options),
      );
      whereIndentedStrings.push({ string: "}", indent });
    });
    return whereIndentedStrings;
  }
}

export namespace GraphPattern {
  export function basic(
    subject: BasicGraphPattern.Subject,
    predicate: BasicGraphPattern.Predicate,
    object: BasicGraphPattern.Object,
  ): GraphPattern {
    return new BasicGraphPattern(subject, predicate, object);
  }

  export function filterExists(graphPattern: GraphPattern): GraphPattern {
    return new FilterExistsGraphPattern(graphPattern);
  }

  export function filterNotExists(graphPattern: GraphPattern): GraphPattern {
    return new FilterNotExistsGraphPattern(graphPattern);
  }

  export function group(
    ...graphPatterns: readonly GraphPattern[]
  ): GraphPattern {
    return new GroupGraphPattern(...graphPatterns);
  }

  export function optional(graphPattern: GraphPattern): GraphPattern {
    return new OptionalGraphPattern(graphPattern);
  }

  export function union(
    ...graphPatterns: readonly GraphPattern[]
  ): GraphPattern {
    return new UnionGraphPattern(...graphPatterns);
  }
}
