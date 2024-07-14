import { BlankNode, DatasetCore, DefaultGraph, NamedNode } from "@rdfjs/types";
import { getRdfList } from "./getRdfList";

export function isRdfList({
  dataset,
  graph,
  node,
}: {
  dataset: DatasetCore;
  graph?: BlankNode | DefaultGraph | NamedNode;
  node: BlankNode | NamedNode;
}): boolean {
  try {
    for (const _ of getRdfList({ dataset, graph, node })) {
      break;
    }
    return true;
  } catch {
    return false;
  }
}
