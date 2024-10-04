import { LanguageTagSet } from "@kos-kit/models";
import * as rdfjs from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { termToString } from "./termToString.js";

type GraphPatternOptions = {
  excludeFromConstruct?: boolean;
  excludeFromWhere?: boolean;
};

export type BasicGraphPattern = {
  // https://www.w3.org/TR/sparql11-query/#BasicGraphPatterns
  // ?s ?p ?o
  readonly object: BasicGraphPattern.Object;
  readonly predicate: BasicGraphPattern.Predicate;
  readonly subject: BasicGraphPattern.Subject;
  readonly type: "Basic";
} & GraphPatternOptions;

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
    | { termType: "rdfList" }
    | { termType: "rdfType" }
    | Variable;
  export type Subject = BlankNode | NamedNode | Variable;
  export type Variable = Omit<rdfjs.Variable, "equals">;
}

export type GraphPattern =
  | BasicGraphPattern
  | ({
      // FILTER EXISTS { ?s ?p ?o }
      readonly graphPattern: GraphPattern;
      readonly type: "FilterExists";
    } & GraphPatternOptions)
  | ({
      // FILTER NOT EXISTS { ?s ?p ?o }
      readonly graphPattern: GraphPattern;
      readonly type: "FilterNotExists";
    } & GraphPatternOptions)
  | ({
      // https://www.w3.org/TR/sparql11-query/#GroupPatterns
      // { { ?s1 ?p1 ?o1 . ?s2 ?p2 ?o2 . }
      readonly graphPatterns: readonly GraphPattern[];
      readonly type: "Group";
    } & GraphPatternOptions)
  | ({
      // https://www.w3.org/TR/sparql11-query/#OptionalMatching
      // OPTIONAL { ?s ?p ?o }
      readonly graphPattern: GraphPattern;
      readonly type: "Optional";
    } & GraphPatternOptions)
  | ({
      // https://www.w3.org/TR/sparql11-query/#alternatives
      // { ?s1 ?p1 ?o1 } UNION { ?s2 ?p2 ?o2 }
      readonly graphPatterns: readonly GraphPattern[];
      readonly type: "Union";
    } & GraphPatternOptions);

export namespace GraphPattern {
  export namespace Array {
    export function sort(
      graphPatterns: readonly GraphPattern[],
    ): readonly GraphPattern[] {
      const graphPatternRank = (graphPattern: GraphPattern) => {
        switch (graphPattern.type) {
          case "Basic":
            return 0;
          case "FilterExists":
          case "FilterNotExists":
            return 2;
          case "Group":
            return 0;
          case "Optional":
            return 1;
          case "Union":
            return 0;
        }
      };

      const sortedGraphPatterns = graphPatterns.concat();
      sortedGraphPatterns.sort((left, right) => {
        return graphPatternRank(left) - graphPatternRank(right);
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

  export function basic(
    subject: BasicGraphPattern.Subject,
    predicate: BasicGraphPattern.Predicate,
    object: BasicGraphPattern.Object,
    options?: GraphPatternOptions,
  ): GraphPattern {
    return {
      object,
      predicate,
      subject,
      type: "Basic",
      ...options,
    };
  }

  export function filterExists(graphPattern: GraphPattern): GraphPattern {
    return {
      graphPattern,
      type: "FilterExists",
    };
  }

  export function filterNotExists(graphPattern: GraphPattern): GraphPattern {
    return {
      graphPattern,
      type: "FilterNotExists",
    };
  }

  export function group(
    ...graphPatterns: readonly GraphPattern[]
  ): GraphPattern {
    return {
      graphPatterns,
      type: "Group",
    };
  }

  export function optional(graphPattern: GraphPattern): GraphPattern {
    return {
      graphPattern,
      type: "Optional",
    };
  }

  export function rdfType(
    subject: BasicGraphPattern.Subject,
    rdfType: BasicGraphPattern.NamedNode,
    options?: GraphPatternOptions,
  ): GraphPattern {
    return {
      predicate: { termType: "rdfType" },
      object: rdfType,
      subject,
      type: "Basic",
      ...options,
    };
  }

  export function toConstructIndentedStrings(
    graphPattern: GraphPattern,
    indent: number,
  ): readonly IndentedString[] {
    if (graphPattern.excludeFromConstruct) {
      return [];
    }

    switch (graphPattern.type) {
      case "Basic": {
        switch (graphPattern.predicate.termType) {
          case "rdfList":
            if (graphPattern.object.termType !== "Variable") {
              throw new RangeError("expected rdfList object to be a variable");
            }
            return [
              {
                indent,
                string: `?${graphPattern.object.value} ?${graphPattern.object.value}Predicate ?${graphPattern.object.value}Object .`,
              },
            ];
          case "rdfType":
            if (graphPattern.object.termType !== "NamedNode") {
              throw new RangeError(
                "expected rdfType object to be a named node",
              );
            }
            // Don't include any rdfs:subClassOf
            return [
              {
                indent,
                string: `${termToString(graphPattern.subject)} <${
                  rdf.type.value
                }> ${termToString(graphPattern.object)} .`,
              },
            ];
          default:
            return [
              {
                indent,
                string: `${termToString(graphPattern.subject)} ${termToString(
                  graphPattern.predicate,
                )} ${termToString(graphPattern.object)} .`,
              },
            ];
        }
      }
      case "FilterExists":
      case "FilterNotExists":
      case "Optional": {
        return toConstructIndentedStrings(graphPattern.graphPattern, indent);
      }
      case "Group":
      case "Union": {
        return GraphPattern.Array.sort(graphPattern.graphPatterns).flatMap(
          (graphPattern_) => toConstructIndentedStrings(graphPattern_, indent),
        );
      }
    }
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
    if (graphPattern.excludeFromWhere) {
      return [];
    }

    switch (graphPattern.type) {
      case "Basic": {
        const whereIndentedStrings: IndentedString[] = [];
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
              throw new RangeError(
                "expected rdfType object to be a named node",
              );
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

        return whereIndentedStrings;
      }
      case "Group": {
        let whereIndentedStrings: IndentedString[] = [{ string: "{", indent }];
        for (const graphPattern_ of graphPattern.graphPatterns) {
          whereIndentedStrings = whereIndentedStrings.concat(
            toWhereIndentedStrings(graphPattern_, indent + TAB_SPACES),
          );
        }
        whereIndentedStrings.push({ string: "}", indent });
        return whereIndentedStrings;
      }
      case "FilterExists":
      case "FilterNotExists":
      case "Optional": {
        const keyword = (): string => {
          switch (graphPattern.type) {
            case "FilterExists":
              return "FILTER EXISTS";
            case "FilterNotExists":
              return "FILTER NOT EXISTS";
            case "Optional":
              return "OPTIONAL";
          }
        };
        return [
          { string: `${keyword()} {`, indent },
          ...toWhereIndentedStrings(
            graphPattern.graphPattern,
            indent + TAB_SPACES,
          ),
          { string: "}", indent },
        ];
      }
      case "Union": {
        let whereIndentedStrings: IndentedString[] = [];
        graphPattern.graphPatterns.forEach((graphPattern_, graphPatternI) => {
          if (graphPatternI > 0) {
            whereIndentedStrings.push({ string: "UNION", indent });
          }
          whereIndentedStrings.push({ string: "{", indent });
          whereIndentedStrings = whereIndentedStrings.concat(
            toWhereIndentedStrings(graphPattern_, indent + TAB_SPACES),
          );
          whereIndentedStrings.push({ string: "}", indent });
        });
        return whereIndentedStrings;
      }
    }
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

  export function union(
    ...graphPatterns: readonly GraphPattern[]
  ): GraphPattern {
    return {
      graphPatterns,
      type: "Union",
    };
  }
}
