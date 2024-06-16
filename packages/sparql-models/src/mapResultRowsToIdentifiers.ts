import { ResultRow } from "sparql-http-client/ResultParser";
import { Identifier } from "../Identifier";

export function mapResultRowsToIdentifiers(
  resultRows: readonly ResultRow[],
  variable: string,
): readonly Identifier[] {
  const identifiers: Identifier[] = [];
  for (const resultRow of resultRows) {
    const identifier = resultRow[variable];
    if (
      identifier &&
      (identifier.termType === "BlankNode" ||
        identifier.termType === "NamedNode")
    ) {
      identifiers.push(identifier);
    }
  }
  return identifiers;
}
