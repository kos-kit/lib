import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { getRdfInstanceQuads } from "./getRdfInstanceQuads.js";

/**
 * Get all unique RDF instances of a given class in the given dataset.
 */
export function* getRdfInstances(kwds: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses?: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Generator<BlankNode | NamedNode> {
  for (const instanceQuad of getRdfInstanceQuads(kwds)) {
    yield instanceQuad.subject as BlankNode | NamedNode;
  }
}
