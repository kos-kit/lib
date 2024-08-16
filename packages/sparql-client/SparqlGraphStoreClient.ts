import { BlankNode, DatasetCore, DefaultGraph, NamedNode } from "@rdfjs/types";

export interface SparqlGraphStoreClient {
  delete(graph: BlankNode | DefaultGraph | NamedNode): Promise<void>;

  getDataset(options?: {
    graph?: BlankNode | DefaultGraph | NamedNode;
  }): Promise<DatasetCore>;

  postDataset(
    payload: DatasetCore,
    options?: { graph?: BlankNode | DefaultGraph | NamedNode },
  ): Promise<void>;

  putDataset(
    payload: DatasetCore,
    options?: { graph?: BlankNode | DefaultGraph | NamedNode },
  ): Promise<void>;
}
