import { LanguageTagSet } from "@kos-kit/models";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern } from "./BasicGraphPattern.js";
import { IndentedString, TAB_SPACES } from "./IndentedString.js";
import { termToString } from "./termToString.js";

type GraphPatternOptions = {
  excludeFromConstruct?: boolean;
  excludeFromWhere?: boolean;
};

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

  /**
   * CONSTRUCT ?subject rdf:type ?rdfType
   * WHERE ?subject rdf:type/rdfs:subClassOf* ?rdfType
   */
  export function rdfType(
    subject: BasicGraphPattern.Subject,
    rdfType: BasicGraphPattern.NamedNode,
    options?: GraphPatternOptions,
  ): readonly GraphPattern[] {
    // Two patterns, one for CONSTRUCT and one for WHERE
    const graphPatterns: GraphPattern[] = [];

    if (!options?.excludeFromConstruct) {
      graphPatterns.push({
        excludeFromWhere: true,
        object: rdfType,
        predicate: rdf.type,
        subject,
        type: "Basic",
      });
    }

    if (!options?.excludeFromWhere) {
      graphPatterns.push(GraphPattern.whereRdfType(subject, rdfType));
    }

    return graphPatterns;
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
        if (graphPattern.predicate.termType === "PropertyPath") {
          throw new RangeError(
            "property paths are not supported in CONSTRUCT strings",
          );
        }

        return [
          {
            indent,
            string: `${termToString(graphPattern.subject)} ${termToString(
              graphPattern.predicate,
            )} ${termToString(graphPattern.object)} .`,
          },
        ];
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

        whereIndentedStrings.push({
          indent,
          string: `${termToString(graphPattern.subject)} ${
            graphPattern.predicate.termType === "PropertyPath"
              ? propertyPathToWhereString(graphPattern.predicate)
              : termToString(graphPattern.predicate)
          } ${termToString(graphPattern.object)} .`,
        });

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

  /**
   * The WHERE-friendly ?subject rdf:type/rdfs:subClassOf* ?rdfType.
   */
  export function whereRdfType(
    subject: BasicGraphPattern.Subject,
    rdfType: BasicGraphPattern.NamedNode,
  ): GraphPattern {
    return {
      excludeFromConstruct: true,
      // ?subject rdf:type/rdf:subClassOf* ?rdfType .
      predicate: {
        propertyPathType: "SequencePath",
        termType: "PropertyPath",
        value: [
          {
            propertyPathType: "PredicatePath",
            termType: "PropertyPath",
            value: rdf.type,
          },
          {
            propertyPathType: "ZeroOrMorePath",
            termType: "PropertyPath",
            value: {
              propertyPathType: "PredicatePath",
              termType: "PropertyPath",
              value: rdfs.subClassOf,
            },
          },
        ],
      },
      object: rdfType,
      subject,
      type: "Basic",
    };
  }
}
