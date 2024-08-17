import {
  BlankNode,
  DatasetCore,
  DefaultGraph,
  NamedNode,
  Quad,
} from "@rdfjs/types";

export interface SparqlGraphStoreClient {
  deleteGraph(graph: BlankNode | DefaultGraph | NamedNode): Promise<void>;

  getGraph(options?: {
    graph: BlankNode | DefaultGraph | NamedNode;
  }): Promise<readonly Quad[]>;

  postGraph(
    graph: BlankNode | DefaultGraph | NamedNode,
    payload: DatasetCore,
  ): Promise<void>;

  putGraph(
    graph: BlankNode | DefaultGraph | NamedNode,
    payload: DatasetCore,
  ): Promise<void>;
}
