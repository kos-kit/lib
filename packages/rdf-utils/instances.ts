import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { instanceQuads } from "./instanceQuads.js";

/**
 * Get all unique RDF instances of a given class in the given dataset.
 */
export function* instances(kwds: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Iterable<BlankNode | NamedNode> {
  for (const instanceQuad of instanceQuads(kwds)) {
    yield instanceQuad.subject as BlankNode | NamedNode;
  }
}
