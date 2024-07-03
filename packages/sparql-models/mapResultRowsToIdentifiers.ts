import { Resource } from "@kos-kit/rdf-resource";
import { ResultRow } from "sparql-http-client/ResultParser";

export function mapResultRowsToIdentifiers(
  resultRows: readonly ResultRow[],
  variable: string,
): readonly Resource.Identifier[] {
  const identifiers: Resource.Identifier[] = [];
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
