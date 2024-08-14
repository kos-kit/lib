import { DatasetCore, Quad_Graph, Stream, Term } from "@rdfjs/types";

export interface SparqlClient {
  readonly query: SparqlClient.Query;
  readonly update: SparqlClient.Update;
}

export namespace SparqlClient {
  export interface Query {
    ask(query: string): Promise<boolean>;
    construct(query: string): Promise<DatasetCore>;
    select(query: string): Promise<readonly Record<string, Term>[]>;
  }

  export interface Store {
    post(stream: Stream, options?: { graph?: Quad_Graph }): Promise<void>;
    put(stream: Stream, options?: { graph?: Quad_Graph }): Promise<void>;
  }

  export interface Update {
    update(query: string): Promise<void>;
  }
}
