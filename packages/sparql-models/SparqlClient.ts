import { DatasetCore, Term } from "@rdfjs/types";

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

  export interface Update {
    update(query: string): Promise<void>;
  }
}
