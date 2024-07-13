import { ParsingQuery } from "sparql-http-client";

export interface SparqlClient {
  readonly query: ParsingQuery;
}
