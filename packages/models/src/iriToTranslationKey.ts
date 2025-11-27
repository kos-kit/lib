import { NamedNode } from "@rdfjs/types";

export function iriToTranslationKey(iri: NamedNode): string {
  return iri.value.replaceAll(".", "_");
}
