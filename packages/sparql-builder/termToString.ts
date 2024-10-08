import { BlankNode, Literal, NamedNode, Variable } from "@rdfjs/types";

export function termToString(
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
