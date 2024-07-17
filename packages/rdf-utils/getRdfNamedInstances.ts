import { DatasetCore, NamedNode } from "@rdfjs/types";
import { getRdfNamedInstanceQuads } from "./getRdfNamedInstanceQuads.js";

/**
 * Get all unique RDF instances of a given class in the given dataset.
 */
export function* getRdfNamedInstances(kwds: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Generator<NamedNode> {
  for (const instanceQuad of getRdfNamedInstanceQuads(kwds)) {
    yield instanceQuad.subject as NamedNode;
  }
}
