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
export type GraphPatternPredicate = NamedNode | GraphPatternVariable | string;
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
      predicate: `<${rdf.type.value}>/<${rdfs.subClassOf.value}>*`,
      object: rdfType,
      optional,
      subject,
    };
  }

  export function toConstructIndentedStrings(
    graphPattern: GraphPattern,
    indent: number,
  ): readonly IndentedString[] {
    let constructStrings = [toIndentedString(graphPattern, indent)];
    if (graphPattern.subGraphPatterns) {
      for (const subGraphPattern of GraphPattern.Array.sort(
        graphPattern.subGraphPatterns,
      )) {
        constructStrings = constructStrings.concat(
          toConstructIndentedStrings(subGraphPattern, indent + TAB_SPACES),
        );
      }
    }
    return constructStrings;
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

  function toIndentedString(
    graphPattern: GraphPattern,
    indent: number,
  ): IndentedString {
    return {
      indent,
      string: `${termToString(graphPattern.subject)} ${termToString(graphPattern.predicate)} ${termToString(graphPattern.object)} .`,
    };
  }

  interface ToWhereOptions {
    includeLanguageTags: LanguageTagSet;
  }

  export function toWhereIndentedStrings(
    graphPattern: GraphPattern,
    indent: number,
    options?: ToWhereOptions,
  ): readonly IndentedString[] {
    let whereStrings = [toIndentedString(graphPattern, indent)];
    if (
      options?.includeLanguageTags &&
      graphPattern.object.termType === "Variable" &&
      graphPattern.object.plainLiteral
    ) {
      const languageTagTests = [...options.includeLanguageTags].map(
        (includeLanguageTag) =>
          `LANG(?${graphPattern.object.value}) = "${includeLanguageTag}"`,
      );

      whereStrings.push({
        indent,
        string: `FILTER (!BOUND(?${graphPattern.object.value}) || ${languageTagTests.join(" || ")} )`,
      });
    }

    if (graphPattern.subGraphPatterns) {
      for (const subGraphPattern of GraphPattern.Array.sort(
        graphPattern.subGraphPatterns,
      )) {
        whereStrings = whereStrings.concat(
          toWhereIndentedStrings(subGraphPattern, indent + TAB_SPACES),
        );
      }
    }
    if (!graphPattern.optional) {
      return whereStrings;
    }

    return [{ indent, string: "OPTIONAL {" }]
      .concat(
        whereStrings.map((whereString) => ({
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
