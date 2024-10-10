import * as rdfjs from "@rdfjs/types";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { PropertyPath } from "./PropertyPath.js";
import { ToWhereOptions } from "./ToWhereOptions.js";
import { termToString } from "./termToString.js";

export abstract class GraphPattern {
  readonly sortRank: number = 0;

  static basic<
    ObjectT extends BasicGraphPattern.Object,
    PredicateT extends BasicGraphPattern.Predicate,
    SubjectT extends BasicGraphPattern.Subject,
  >(
    subject: SubjectT,
    predicate: PredicateT,
    object: ObjectT,
  ): BasicGraphPattern<ObjectT, PredicateT, SubjectT> {
    return new BasicGraphPattern(subject, predicate, object);
  }

  static filterExists(graphPattern: GraphPattern): GraphPattern {
    return new FilterExistsGraphPattern(graphPattern);
  }

  static filterNotExists(graphPattern: GraphPattern): GraphPattern {
    return new FilterNotExistsGraphPattern(graphPattern);
  }

  static group(graphPatterns: Iterable<GraphPattern>): GraphPattern {
    return new GroupGraphPattern(graphPatterns);
  }

  static optional(graphPattern: GraphPattern): GraphPattern {
    return new OptionalGraphPattern(graphPattern);
  }

  static union(...graphPatterns: readonly GraphPattern[]): GraphPattern {
    return new UnionGraphPattern(graphPatterns);
  }

  static variable(value: string): GraphPattern.Variable {
    return {
      termType: "Variable",
      value,
    };
  }

  /**
   * Limit a graph pattern to certain scope, such as CONSTRUCT or WHERE.
   */
  scoped(...scopes: readonly ScopedGraphPattern.Scope[]): ScopedGraphPattern {
    return new ScopedGraphPattern(
      this,
      new Set<ScopedGraphPattern.Scope>(scopes),
    );
  }

  abstract toConstructIndentedStrings(indent: number): Iterable<IndentedString>;

  abstract toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): Iterable<IndentedString>;

  toWhereString(options?: ToWhereOptions): string {
    return this.toWhereStrings(options)[Symbol.iterator]().join("\n");
  }

  *toWhereStrings(options?: ToWhereOptions): Iterable<string> {
    for (const indentedString of this.toWhereIndentedStrings(0, options)) {
      yield IndentedString.toString(indentedString);
    }
  }
}

export namespace GraphPattern {
  export type Variable = Omit<rdfjs.Variable, "equals">;
}

/**
 * Basic graph pattern: ?s ?p ?o
 *
 * https://www.w3.org/TR/sparql11-query/#BasicGraphPatterns
 */
class BasicGraphPattern<
  ObjectT extends BasicGraphPattern.Object,
  PredicateT extends BasicGraphPattern.Predicate,
  SubjectT extends BasicGraphPattern.Subject,
> extends GraphPattern {
  constructor(
    readonly subject: SubjectT,
    readonly predicate: PredicateT,
    readonly object: ObjectT,
  ) {
    super();
  }

  /**
   * Chain additional graph patterns to this one on the object.
   *
   * This makes it easier to build graph patterns without explicitly declaring variables e.g.,
   *
   * Before:
   * const variable = ...;
   * yield GraphPattern.basic(s, p, variable);
   * yield GraphPattern.basic(variable, p, o);
   *
   * After:
   * yield GraphPattern.basic(s, p, variable).chainObject(variable => GraphPattern.basic(variable, p, o));
   * @param chain
   */
  *chainObject(
    chain: (object: ObjectT) => Iterable<GraphPattern>,
  ): Iterable<GraphPattern> {
    yield this;
    yield* chain(this.object);
  }

  /**
   * Chain additional graph patterns to this one on the subject.
   *
   * See chainObject example above.
   */
  *chainSubject(
    chain: (subject: SubjectT) => Iterable<GraphPattern>,
  ): Iterable<GraphPattern> {
    yield this;
    yield* chain(this.subject);
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
    | (GraphPattern.Variable & {
        plainLiteral?: boolean;
      });
  export type Predicate =
    | NamedNode
    | { termType: "PropertyPath"; value: PropertyPath }
    | GraphPattern.Variable;
  export type Subject = BlankNode | NamedNode | GraphPattern.Variable;
}

/**
 * FILTER EXISTS { ?s ?p ?o }
 */
class FilterExistsGraphPattern extends GraphPattern {
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
class FilterNotExistsGraphPattern extends GraphPattern {
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
class GroupGraphPattern extends GraphPattern {
  private readonly graphPatterns: GraphPattern[];

  constructor(graphPatterns: Iterable<GraphPattern>) {
    super();
    // Convert to an array so we can iterate over it multiple times
    this.graphPatterns = [...graphPatterns];
  }

  override *toConstructIndentedStrings(
    indent: number,
  ): Iterable<IndentedString> {
    for (const graphPattern of this.graphPatterns) {
      yield* graphPattern.toConstructIndentedStrings(indent);
    }
  }

  override toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    let whereIndentedStrings: IndentedString[] = [{ string: "{", indent }];
    for (const graphPattern of this.graphPatterns) {
      whereIndentedStrings = whereIndentedStrings.concat(
        ...graphPattern.toWhereIndentedStrings(indent + TAB_SPACES, options),
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
class OptionalGraphPattern extends GraphPattern {
  override readonly sortRank: number = 1;

  constructor(readonly graphPattern: GraphPattern) {
    super();
  }

  override toConstructIndentedStrings(
    indent: number,
  ): Iterable<IndentedString> {
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
class ScopedGraphPattern extends GraphPattern {
  constructor(
    readonly graphPattern: GraphPattern,
    readonly scopes: Set<ScopedGraphPattern.Scope>,
  ) {
    super();
  }

  override *toConstructIndentedStrings(
    indent: number,
  ): Iterable<IndentedString> {
    if (this.scopes.has("CONSTRUCT")) {
      yield* this.graphPattern.toConstructIndentedStrings(indent);
    }
  }

  override *toWhereIndentedStrings(
    indent: number,
    options?: ToWhereOptions,
  ): Iterable<IndentedString> {
    if (this.scopes.has("WHERE")) {
      yield* this.graphPattern.toWhereIndentedStrings(indent, options);
    }
  }
}

namespace ScopedGraphPattern {
  export type Scope = "CONSTRUCT" | "WHERE";
}

/**
 *  { ?s1 ?p1 ?o1 } UNION { ?s2 ?p2 ?o2 . }
 *  https://www.w3.org/TR/sparql11-query/#alternatives
 */
class UnionGraphPattern extends GraphPattern {
  constructor(private readonly graphPatterns: readonly GraphPattern[]) {
    super();
  }

  override *toConstructIndentedStrings(
    indent: number,
  ): Iterable<IndentedString> {
    for (const graphPattern of this.graphPatterns) {
      yield* graphPattern.toConstructIndentedStrings(indent);
    }
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
        ...graphPattern.toWhereIndentedStrings(indent + TAB_SPACES, options),
      );
      whereIndentedStrings.push({ string: "}", indent });
    });
    return whereIndentedStrings;
  }
}
