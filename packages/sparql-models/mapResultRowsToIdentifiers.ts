import { ResultRow } from "sparql-http-client/ResultParser";
import { BlankNode, NamedNode } from "@rdfjs/types";

export function mapResultRowsToIdentifiers(
  resultRows: readonly ResultRow[],
  variable: string,
): readonly (BlankNode | NamedNode)[] {
  const identifiers: (BlankNode | NamedNode)[] = [];
  for (const resultRow of resultRows) {
    const identifier = resultRow[variable];
    if (
      typeof identifier !== "undefined" &&
      (identifier.termType === "BlankNode" ||
        identifier.termType === "NamedNode")
    ) {
      identifiers.push(identifier);
    }
  }
  return identifiers;
}
