import { DatasetCore, NamedNode, Quad } from "@rdfjs/types";
import { instanceQuads } from "./instanceQuads.js";

/**
 * Get all unique RDF instances of a given class in the given dataset.
 */
export function* namedInstanceQuads(kwds: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Iterable<Quad> {
  for (const instanceQuad of instanceQuads(kwds)) {
    if (instanceQuad.subject.termType === "NamedNode") {
      yield instanceQuad;
    }
  }
}
