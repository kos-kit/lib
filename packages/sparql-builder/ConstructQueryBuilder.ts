import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";
import { TAB_SPACES } from "./IndentedString.js";
import { termToString } from "./termToString.js";

export class ConstructQueryBuilder {
  private graphPatterns: GraphPattern[] = [];
  private readonly includeLanguageTags: readonly string[];
  private values: [
    GraphPattern.Variable,
    (Literal | BlankNode | NamedNode)[],
  ][] = [];

  constructor(options?: { includeLanguageTags: readonly string[] }) {
    this.includeLanguageTags = options?.includeLanguageTags ?? [];
  }

  addGraphPattern(graphPattern: GraphPattern): this {
    this.graphPatterns.push(graphPattern);
    return this;
  }

  addGraphPatterns(graphPatterns: Iterable<GraphPattern>): this {
    this.graphPatterns.push(...graphPatterns);
    return this;
  }

  addValues(
    variable: GraphPattern.Variable,
    ...values: (Literal | BlankNode | NamedNode)[]
  ): this {
    for (const variableValues of this.values) {
      if (variableValues[0].value === variable.value) {
        variableValues[1].push(...values);
        return this;
      }
    }
    this.values.push([variable, [...values]]);
    return this;
  }

  build(): string {
    if (this.graphPatterns.length === 0) {
      throw new RangeError("empty graph patterns");
    }

    const sortedGraphPatterns = GraphPatterns.fromArray(
      this.graphPatterns,
    ).sort();

    // Put the VALUES first to help Oxigraph's SPARQL query planner
    const valuesString = this.valuesString();

    return `\
CONSTRUCT {
${sortedGraphPatterns.toConstructString()}
} WHERE {
${
  valuesString.length > 0 ? `${" ".repeat(TAB_SPACES) + valuesString}\n` : ""
}${sortedGraphPatterns.toWhereString({
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
