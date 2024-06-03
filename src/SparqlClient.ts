import { DatasetCore, Quad } from "@rdfjs/types";
import { ParsingQuery } from "sparql-http-client";
import ParsingSparqlClient from "sparql-http-client/ParsingClient";

export class SparqlClient {
  private readonly delegate: ParsingSparqlClient;

  constructor({ endpointUrl }: { endpointUrl: string }) {
    this.delegate = new ParsingSparqlClient({ endpointUrl });
  }

  get query(): ParsingQuery<DatasetCore<Quad, Quad>> {
    return this.delegate.query;
  }
}
