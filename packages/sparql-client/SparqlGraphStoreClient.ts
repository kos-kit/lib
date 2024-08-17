import { DatasetCore, DefaultGraph, NamedNode, Quad } from "@rdfjs/types";

export interface SparqlGraphStoreClient {
  deleteGraph(graph: DefaultGraph | NamedNode): Promise<void>;

  getGraph(graph: DefaultGraph | NamedNode): Promise<DatasetCore>;

  postGraph(
    graph: DefaultGraph | NamedNode,
    payload: Iterable<Quad>,
  ): Promise<void>;

  putGraph(
    graph: DefaultGraph | NamedNode,
    payload: Iterable<Quad>,
  ): Promise<void>;
}
