import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";

export interface SparqlQueryClient {
  ask(query: string): Promise<boolean>;
  construct(query: string): Promise<DatasetCore>;
  select(
    query: string,
  ): Promise<readonly Record<string, BlankNode | Literal | NamedNode>[]>;
}
