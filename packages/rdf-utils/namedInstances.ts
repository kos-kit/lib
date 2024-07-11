import { DatasetCore, NamedNode } from "@rdfjs/types";
import { namedInstanceQuads } from "./namedInstanceQuads.js";

/**
 * Get all unique RDF instances of a given class in the given dataset.
 */
export function* namedInstances(kwds: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Iterable<NamedNode> {
  for (const instanceQuad of namedInstanceQuads(kwds)) {
    yield instanceQuad.subject as NamedNode;
  }
}
