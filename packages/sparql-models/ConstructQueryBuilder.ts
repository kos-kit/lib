import { LanguageTagSet } from "@kos-kit/models";
import { BlankNode, Literal, NamedNode, Variable } from "@rdfjs/types";
import { GraphPattern, GraphPatternVariable } from "./GraphPattern.js";

interface IndentedString {
  indent: number;
  string: string;
}

export class ConstructQueryBuilder {
  private graphPatterns: GraphPattern[] = [];
  private includeLanguageTags: LanguageTagSet;
  private values: [
    GraphPatternVariable,
    (Literal | BlankNode | NamedNode)[],
  ][] = [];

  constructor(options?: { includeLanguageTags: LanguageTagSet }) {
    this.includeLanguageTags =
      options?.includeLanguageTags ?? new LanguageTagSet();
  }

  addGraphPatterns(...graphPatterns: GraphPattern[]): this {
    this.graphPatterns.push(...graphPatterns);
    return this;
  }

  addValues(
    variable: GraphPatternVariable,
    ...values: (Literal | BlankNode | NamedNode)[]
  ): this {
    for (const variableValues of this.values) {
      if (variableValues[0].value === variable.value) {
        variableValues[1].push(...values);
        return this;
      }
    }
    this.values.push([variable, values]);
    return this;
  }

  build(): string {
    if (this.graphPatterns.length === 0) {
      throw new RangeError("empty graph patterns");
    }

    const sortedGraphPatterns = sortGraphPatterns(this.graphPatterns);

    // Put the VALUES first to help Oxigraph's SPARQL query planner
    const valuesString = this.valuesString();

    return `\
CONSTRUCT {
${indentedStringsToString(
  sortedGraphPatterns.flatMap((graphPattern) =>
    this.graphPatternToConstructStrings(graphPattern, TAB_SPACES),
  ),
)}
} WHERE {
${valuesString.length > 0 ? `${" ".repeat(TAB_SPACES) + valuesString}\n` : ""}${indentedStringsToString(
  sortedGraphPatterns.flatMap((graphPattern) =>
    this.graphPatternToWhereStrings(graphPattern, TAB_SPACES),
  ),
)}
}`;
  }

  private graphPatternToConstructStrings(
    graphPattern: GraphPattern,
    indent: number,
  ): readonly IndentedString[] {
    let constructStrings = [this.graphPatternToString(graphPattern, indent)];
    if (graphPattern.subGraphPatterns) {
      for (const subGraphPattern of sortGraphPatterns(
        graphPattern.subGraphPatterns,
      )) {
        constructStrings = constructStrings.concat(
          this.graphPatternToConstructStrings(
            subGraphPattern,
            indent + TAB_SPACES,
          ),
        );
      }
    }
    return constructStrings;
  }

  private graphPatternToString(
    graphPattern: GraphPattern,
    indent: number,
  ): IndentedString {
    return {
      indent,
      string: `${this.termToString(graphPattern.subject)} ${this.termToString(graphPattern.predicate)} ${this.termToString(graphPattern.object)} .`,
    };
  }

  private graphPatternToWhereStrings(
    graphPattern: GraphPattern,
    indent: number,
  ): readonly IndentedString[] {
    let whereStrings = [this.graphPatternToString(graphPattern, indent)];
    if (
      graphPattern.object.termType === "Variable" &&
      graphPattern.object.plainLiteral
    ) {
      const languageTagTests = [...this.includeLanguageTags].map(
        (includeLanguageTag) =>
          `LANG(?${graphPattern.object.value}) = "${includeLanguageTag}"`,
      );

      whereStrings.push({
        indent,
        string: `FILTER (!BOUND(?${graphPattern.object.value}) || ${languageTagTests.join(" || ")} )`,
      });
    }

    if (graphPattern.subGraphPatterns) {
      for (const subGraphPattern of sortGraphPatterns(
        graphPattern.subGraphPatterns,
      )) {
        whereStrings = whereStrings.concat(
          this.graphPatternToWhereStrings(subGraphPattern, indent + TAB_SPACES),
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

  private termToString(
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
        return `"${literalValue.value}"${
          literalValue.datatype.value.length > 0 &&
          literalValue.datatype.value !==
            "http://www.w3.org/2001/XMLSchema#string" &&
          literalValue.datatype.value !==
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
            ? `^^${literalValue.datatype.value}`
            : ""
        }${literalValue.language ? `@${literalValue.language}` : ""}`;
      }
      case "Variable":
        return `?${term.value}`;
    }
  }

  private valuesString() {
    if (this.values.length === 0) {
      return "";
    }
    if (this.values.length > 1) {
      throw new Error("multiple values not supported yet");
    }

    const variableValues = this.values[0];
    const [variable, values] = variableValues;

    return `VALUES ?${variable.value} { ${values.map((value) => this.termToString(value)).join(" ")} }`;
  }
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
    }
    return right.optional ? -1 : 0;
  });
  return sortedGraphPatterns;
}

const TAB_SPACES = 2;
