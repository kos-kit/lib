import { LanguageTagSet } from "@kos-kit/models";
import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { GraphPattern, GraphPatternVariable } from "./GraphPattern.js";
import { TAB_SPACES } from "./IndentedString.js";
import { termToString } from "./termToString.js";

export class ConstructQueryBuilder {
  private readonly includeLanguageTags: LanguageTagSet;

  private graphPatterns: GraphPattern[] = [];
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

    const sortedGraphPatterns = GraphPattern.Array.sort(this.graphPatterns);

    // Put the VALUES first to help Oxigraph's SPARQL query planner
    const valuesString = this.valuesString();

    return `\
CONSTRUCT {
${GraphPattern.Array.toConstructString(sortedGraphPatterns)}
} WHERE {
${
  valuesString.length > 0 ? `${" ".repeat(TAB_SPACES) + valuesString}\n` : ""
}${GraphPattern.Array.toWhereString(sortedGraphPatterns, {
  includeLanguageTags: this.includeLanguageTags,
})}
}`;
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

    return `VALUES ?${variable.value} { ${values
      .map((value) => termToString(value))
      .join(" ")} }`;
  }
}
