import { BlankNode, Literal, NamedNode, Variable } from "@rdfjs/types";
import { GraphPattern } from "./GraphPattern";
import { LanguageTagSet } from "../LanguageTagSet";

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
    for (const subGraphPattern of sortGraphPatterns(
      graphPattern.subGraphPatterns,
    )) {
      constructStrings = constructStrings.concat(
        graphPatternToConstructStrings(subGraphPattern, indent + TAB_SPACES),
      );
    }
  }
  return constructStrings;
}

function graphPatternToFilterStrings(
  graphPattern: GraphPattern,
  includeLanguageTags: LanguageTagSet,
): readonly string[] {
  if (includeLanguageTags.size === 0) {
    return [];
  }

  let filterStrings: string[] = [];
  if (
    graphPattern.object.termType === "Variable" &&
    graphPattern.object.plainLiteral
  ) {
    const languageTagTests = [...includeLanguageTags].map(
      (includeLanguageTag) =>
        `LANG(?${graphPattern.object.value}) = "${includeLanguageTag}"`,
    );

    filterStrings.push(
      `FILTER (!BOUND(?${graphPattern.object.value}) || ${languageTagTests.join(" || ")} )`,
    );
  }

  if (graphPattern.subGraphPatterns) {
    for (const subGraphPattern of sortGraphPatterns(
      graphPattern.subGraphPatterns,
    )) {
      filterStrings = filterStrings.concat(
        graphPatternToFilterStrings(subGraphPattern, includeLanguageTags),
      );
    }
  }

  return filterStrings;
}

function graphPatternToWhereStrings(
  graphPattern: GraphPattern,
  indent: number,
): readonly IndentedString[] {
  let whereStrings = [graphPatternToString(graphPattern, indent)];
  if (graphPattern.subGraphPatterns) {
    for (const subGraphPattern of sortGraphPatterns(
      graphPattern.subGraphPatterns,
    )) {
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
  options?: { includeLanguageTags: LanguageTagSet },
) {
  if (graphPatterns.length === 0) {
    throw new RangeError("empty graph patterns");
  }

  const sortedGraphPatterns = sortGraphPatterns(graphPatterns);

  const filterStrings = sortedGraphPatterns
    .flatMap((graphPattern) =>
      graphPatternToFilterStrings(
        graphPattern,
        options?.includeLanguageTags ?? new LanguageTagSet(),
      ),
    )
    .map((filterString) => " ".repeat(TAB_SPACES) + filterString)
    .join("\n");

  return `\
CONSTRUCT {
${indentedStringsToString(
  sortedGraphPatterns.flatMap((graphPattern) =>
    graphPatternToConstructStrings(graphPattern, TAB_SPACES),
  ),
)}
} WHERE {
${indentedStringsToString(
  sortedGraphPatterns.flatMap((graphPattern) =>
    graphPatternToWhereStrings(graphPattern, TAB_SPACES),
  ),
)}${filterStrings.length > 0 ? "\n" + filterStrings : ""}
}`;
}

function indentedStringsToString(
  indentedStrings: readonly IndentedString[],
): string {
  return indentedStrings
    .map(({ indent, string }) => " ".repeat(indent) + string)
    .join("\n");
}

function sortGraphPatterns(
  graphPatterns: readonly GraphPattern[],
): readonly GraphPattern[] {
  const sortedGraphPatterns = graphPatterns.concat();
  sortedGraphPatterns.sort((left, right) => {
    // Required then optional.
    if (left.optional) {
      return right.optional ? 0 : 1;
    } else {
      return right.optional ? -1 : 0;
    }
  });
  return sortedGraphPatterns;
}

function termToString(
  term:
    | Omit<BlankNode, "equals">
    | Omit<Literal, "equals">
    | Omit<NamedNode, "equals">
    | Omit<Variable, "equals">,
): string {
  switch (term.termType) {
    case "BlankNode":
      return `_:${term.value}`;
    case "NamedNode":
      return `<${term.value}>`;
    case "Literal": {
      const literalValue: Omit<Literal, "equals"> = term;
      return (
        '"' +
        literalValue.value +
        '"' +
        (literalValue.datatype &&
        literalValue.datatype.value !==
          "http://www.w3.org/2001/XMLSchema#string" &&
        literalValue.datatype.value !==
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
          ? "^^" + literalValue.datatype.value
          : "") +
        (literalValue.language ? "@" + literalValue.language : "")
      );
    }
    case "Variable":
      return `?${term.value}`;
  }
}
