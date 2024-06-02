import { BlankNode, Literal, NamedNode, Variable } from "@rdfjs/types";
import { GraphPattern } from "./GraphPattern";
import { identifierToString } from "../../utilities";
import rdfString from "rdf-string";

const TAB_SPACES = 2;

interface IndentedString {
  indent: number;
  string: string;
}

function graphPatternToString(
  graphPattern: GraphPattern,
  indent: number,
): IndentedString {
  return {
    indent,
    string: `${termToString(graphPattern.subject)} ${termToString(graphPattern.predicate)} ${termToString(graphPattern.object)} .`,
  };
}

function graphPatternToConstructStrings(
  graphPattern: GraphPattern,
  indent: number,
): readonly IndentedString[] {
  let constructStrings = [graphPatternToString(graphPattern, indent)];
  if (graphPattern.subGraphPatterns) {
    for (const subGraphPattern of graphPattern.subGraphPatterns) {
      constructStrings = constructStrings.concat(
        graphPatternToConstructStrings(subGraphPattern, indent + TAB_SPACES),
      );
    }
  }
  return constructStrings;
}

function graphPatternToWhereStrings(
  graphPattern: GraphPattern,
  indent: number,
): readonly IndentedString[] {
  let whereStrings = [graphPatternToString(graphPattern, indent)];
  if (graphPattern.subGraphPatterns) {
    for (const subGraphPattern of graphPattern.subGraphPatterns) {
      whereStrings = whereStrings.concat(
        graphPatternToWhereStrings(subGraphPattern, indent + TAB_SPACES),
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

export function graphPatternsToConstructQuery(
  graphPatterns: readonly GraphPattern[],
) {
  return `\
CONSTRUCT {
${indentedStringsToString(
  graphPatterns.flatMap((graphPattern) =>
    graphPatternToConstructStrings(graphPattern, TAB_SPACES),
  ),
)}
} WHERE {
${indentedStringsToString(
  graphPatterns.flatMap((graphPattern) =>
    graphPatternToWhereStrings(graphPattern, TAB_SPACES),
  ),
)}
}
`;
}

function indentedStringsToString(
  indentedStrings: readonly IndentedString[],
): string {
  return indentedStrings
    .map(({ indent, string }) => " ".repeat(indent) + string)
    .join("\n");
}

function termToString(
  term: BlankNode | Literal | NamedNode | Variable,
): string {
  switch (term.termType) {
    case "BlankNode":
    case "NamedNode":
      return identifierToString(term);
    case "Literal":
    case "Variable":
      return rdfString.termToString(term)!;
  }
}
