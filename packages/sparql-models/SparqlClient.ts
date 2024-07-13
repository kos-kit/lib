import { DatasetCore } from "@rdfjs/types";
import { ResultRow } from "sparql-http-client/ResultParser";

export interface SparqlClient {
  readonly query: SparqlClient.Query;
}

export namespace SparqlClient {
  export interface Query {
    ask(query: string): Promise<boolean>;
    construct(query: string): Promise<DatasetCore>;
    select(query: string): Promise<readonly ResultRow[]>;
    update(query: string): Promise<void>;
  }
}
