import { LanguageTagSet } from "@kos-kit/models";
import * as rdfjs from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { termToString } from "./termToString.js";

type BlankNode = Omit<rdfjs.BlankNode, "equals">;
export type GraphPatternObject =
  | BlankNode
  | Literal
  | NamedNode
  | (GraphPatternVariable & {
      plainLiteral?: boolean;
    });
export type GraphPatternPredicate =
  | NamedNode
  | { termType: "rdfList" }
  | { termType: "rdfType" }
  | GraphPatternVariable;
export type GraphPatternSubject = BlankNode | NamedNode | GraphPatternVariable;
export type GraphPatternVariable = Omit<rdfjs.Variable, "equals">;
type Literal = Omit<rdfjs.Literal, "equals">;
type NamedNode = Omit<rdfjs.NamedNode, "equals">;

export interface GraphPattern {
  object: GraphPatternObject;
  optional?: boolean;
  predicate: GraphPatternPredicate;
  subGraphPatterns?: readonly GraphPattern[];
  // For ?label ?license ...
  subject: GraphPatternSubject;
}

export namespace GraphPattern {
  export namespace Array {
    export function sort(
      graphPatterns: readonly GraphPattern[],
    ): readonly GraphPattern[] {
      const sortedGraphPatterns = graphPatterns.concat();
      sortedGraphPatterns.sort((left, right) => {
        // Required then optional.
        if (left.optional) {
          return right.optional ? 0 : 1;
        }
        return right.optional ? -1 : 0;
      });
      return sortedGraphPatterns;
    }

    export function toConstructString(
      graphPatterns: readonly GraphPattern[],
    ): string {
      return GraphPattern.Array.toConstructStrings(graphPatterns).join("\n");
    }

    export function toConstructStrings(
      graphPatterns: readonly GraphPattern[],
    ): readonly string[] {
      return graphPatterns
        .flatMap((graphPattern) =>
          GraphPattern.toConstructIndentedStrings(graphPattern, TAB_SPACES),
        )
        .map(IndentedString.toString);
    }

    export function toWhereString(
      graphPatterns: readonly GraphPattern[],
      options?: ToWhereOptions,
    ): string {
      return GraphPattern.Array.toWhereStrings(graphPatterns, options).join(
        "\n",
      );
    }

    export function toWhereStrings(
      graphPatterns: readonly GraphPattern[],
      options?: ToWhereOptions,
    ): readonly string[] {
      return graphPatterns
        .flatMap((graphPattern) =>
          GraphPattern.toWhereIndentedStrings(
            graphPattern,
            TAB_SPACES,
            options,
          ),
        )
        .map(IndentedString.toString);
    }
  }

  export function fromTriple(
    subject: GraphPatternSubject,
    predicate: GraphPatternPredicate,
    object: GraphPatternObject,
    options?: Omit<GraphPattern, "object" | "predicate" | "subject">,
  ): GraphPattern {
    return {
      object,
      predicate,
      subject,
      ...options,
    };
  }

  export function rdfType({
    optional,
    rdfType,
    subject,
  }: {
    optional?: boolean;
    rdfType: NamedNode;
    subject: GraphPatternSubject;
  }): GraphPattern {
    return {
      predicate: { termType: "rdfType" },
      object: rdfType,
      optional,
      subject,
    };
  }

  export function toConstructIndentedStrings(
    graphPattern: GraphPattern,
    indent: number,
  ): readonly IndentedString[] {
    let constructIndentedStrings: IndentedString[] = [];

    switch (graphPattern.predicate.termType) {
      case "rdfList":
        if (graphPattern.object.termType !== "Variable") {
          throw new RangeError("expected rdfList object to be a variable");
        }
        constructIndentedStrings.push({
          indent,
          string: `?${graphPattern.object.value} ?${graphPattern.object.value}Predicate ?${graphPattern.object.value}Object .`,
        });
        break;
      case "rdfType":
        if (graphPattern.object.termType !== "NamedNode") {
          throw new RangeError("expected rdfType object to be a named node");
        }
        // Don't include any rdfs:subClassOf
        constructIndentedStrings.push({
          indent,
          string: `${termToString(graphPattern.subject)} <${
            rdf.type.value
          }> ${termToString(graphPattern.object)} .`,
        });
        break;
      default:
        constructIndentedStrings.push({
          indent,
          string: `${termToString(graphPattern.subject)} ${termToString(
            graphPattern.predicate,
          )} ${termToString(graphPattern.object)} .`,
        });
        break;
    }

    if (graphPattern.subGraphPatterns) {
      for (const subGraphPattern of GraphPattern.Array.sort(
        graphPattern.subGraphPatterns,
      )) {
        constructIndentedStrings = constructIndentedStrings.concat(
          toConstructIndentedStrings(subGraphPattern, indent + TAB_SPACES),
        );
      }
    }
    return constructIndentedStrings;
  }

  export function toConstructString(graphPattern: GraphPattern): string {
    return toConstructStrings(graphPattern).join("\n");
  }

  export function toConstructStrings(
    graphPattern: GraphPattern,
  ): readonly string[] {
    return toConstructIndentedStrings(graphPattern, 0).map(
      IndentedString.toString,
    );
  }

  interface ToWhereOptions {
    includeLanguageTags: LanguageTagSet;
  }

  export function toWhereIndentedStrings(
    graphPattern: GraphPattern,
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    let whereIndentedStrings: IndentedString[] = [];

    switch (graphPattern.predicate.termType) {
      case "rdfList":
        if (graphPattern.object.termType !== "Variable") {
          throw new RangeError("expected rdfList object to be a variable");
        }
        whereIndentedStrings.push(
          {
            indent,
            string: `${termToString(graphPattern.subject)} <${
              rdf.rest.value
            }>*/<${rdf.first.value}>? ?${graphPattern.object.value} .`,
          },
          {
            indent,
            string: `?${graphPattern.object.value} ?${graphPattern.object.value}Predicate ?${graphPattern.object.value}Object .`,
          },
        );
        break;
      case "rdfType":
        if (graphPattern.object.termType !== "NamedNode") {
          throw new RangeError("expected rdfType object to be a named node");
        }
        whereIndentedStrings.push({
          indent,
          string: `${termToString(graphPattern.subject)} <${rdf.type.value}>/<${
            rdfs.subClassOf.value
          }>* ${termToString(graphPattern.object)} .`,
        });
        break;
      default:
        whereIndentedStrings.push({
          indent,
          string: `${termToString(graphPattern.subject)} ${termToString(
            graphPattern.predicate,
          )} ${termToString(graphPattern.object)} .`,
        });
        break;
    }

    if (
      options?.includeLanguageTags &&
      graphPattern.object.termType === "Variable" &&
      graphPattern.object.plainLiteral
    ) {
      const languageTagTests = [...options.includeLanguageTags].map(
        (includeLanguageTag) =>
          `LANG(?${graphPattern.object.value}) = "${includeLanguageTag}"`,
      );

      whereIndentedStrings.push({
        indent,
        string: `FILTER (!BOUND(?${
          graphPattern.object.value
        }) || ${languageTagTests.join(" || ")} )`,
      });
    }

    if (graphPattern.subGraphPatterns) {
      for (const subGraphPattern of GraphPattern.Array.sort(
        graphPattern.subGraphPatterns,
      )) {
        whereIndentedStrings = whereIndentedStrings.concat(
          toWhereIndentedStrings(subGraphPattern, indent + TAB_SPACES),
        );
      }
    }
    if (!graphPattern.optional) {
      return whereIndentedStrings;
    }

    return [{ indent, string: "OPTIONAL {" }]
      .concat(
        whereIndentedStrings.map((whereString) => ({
          indent: whereString.indent + TAB_SPACES,
          string: whereString.string,
        })),
      )
      .concat([{ indent, string: "}" }]);
  }

  export function toWhereString(
    graphPattern: GraphPattern,
    options?: ToWhereOptions,
  ): string {
    return GraphPattern.toWhereStrings(graphPattern, options).join("\n");
  }

  export function toWhereStrings(
    graphPattern: GraphPattern,
    options?: ToWhereOptions,
  ): readonly string[] {
    return toWhereIndentedStrings(graphPattern, 0, options).map(
      IndentedString.toString,
    );
  }
}
