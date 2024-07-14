import { DatasetCore, NamedNode, Quad } from "@rdfjs/types";
import { getRdfInstanceQuads } from "./getRdfInstanceQuads.js";

/**
 * Get all unique RDF instances of a given class in the given dataset.
 */
export function* getRdfNamedInstanceQuads(kwds: {
  class_: NamedNode;
  dataset: DatasetCore;
  includeSubclasses: boolean;
  instanceOfPredicate?: NamedNode;
  subClassOfPredicate?: NamedNode;
}): Iterable<Quad> {
  for (const instanceQuad of getRdfInstanceQuads(kwds)) {
    if (instanceQuad.subject.termType === "NamedNode") {
      yield instanceQuad;
    }
  }
}
