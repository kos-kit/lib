import { DatasetCore } from "@rdfjs/types";
import { ResultRow } from "sparql-http-client/ResultParser";

export interface SparqlClient {
  readonly query: SparqlClient.Query;
  readonly update: SparqlClient.Update;
}

export namespace SparqlClient {
  export interface Query {
    ask(query: string): Promise<boolean>;
    construct(query: string): Promise<DatasetCore>;
    select(query: string): Promise<readonly ResultRow[]>;
  }

  export interface Update {
    update(query: string): Promise<void>;
  }
}
