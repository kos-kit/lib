import { QueryOptions } from "sparql-http-client";
import Delegate, { Options } from "sparql-http-client/ParsingClient.js";
import { SparqlClient } from "./SparqlClient.js";

export class HttpSparqlClient implements SparqlClient {
  private readonly delegate: Delegate;
  private readonly queryOptions?: QueryOptions;

  constructor(options: Options & QueryOptions) {
    this.delegate = new Delegate(options);
    this.queryOptions = options;
  }

  readonly query: SparqlClient.Query = {
    ask: (query: string) => this.delegate.query.ask(query, this.queryOptions),
    construct: (query: string) =>
      this.delegate.query.construct(query, this.queryOptions),
    select: (query: string) =>
      this.delegate.query.select(query, this.queryOptions),
  };

  readonly update: SparqlClient.Update = {
    update: (query: string) =>
      this.delegate.query.update(query, this.queryOptions),
  };
}
