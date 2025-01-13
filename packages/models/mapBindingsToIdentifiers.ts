import { BlankNode, Literal, NamedNode } from "@rdfjs/types";

export function mapBindingsToIdentifiers(
  bindings: readonly Record<string, BlankNode | NamedNode | Literal>[],
  variable: string,
): readonly NamedNode[] {
  const identifiers: NamedNode[] = [];
  for (const bindings_ of bindings) {
    const identifier = bindings_[variable];
    if (
      typeof identifier !== "undefined" &&
      identifier.termType === "NamedNode"
    ) {
      identifiers.push(identifier);
    }
  }
  return identifiers;
}
