import { NamedNode } from "@rdfjs/types";
import { ResultRow } from "sparql-http-client/ResultParser";

export function mapResultRowsToIdentifiers(
  resultRows: readonly ResultRow[],
  variable: string,
): readonly NamedNode[] {
  const identifiers: NamedNode[] = [];
  for (const resultRow of resultRows) {
    const identifier = resultRow[variable];
    if (
      typeof identifier !== "undefined" &&
      identifier.termType === "NamedNode"
    ) {
      identifiers.push(identifier);
    }
  }
  return identifiers;
}
