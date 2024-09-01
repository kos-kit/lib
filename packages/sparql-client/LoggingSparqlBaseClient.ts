import { Logger } from "pino";
import { SparqlGraphStoreClient } from "./SparqlGraphStoreClient.js";
import { SparqlQueryClient } from "./SparqlQueryClient";
import { SparqlUpdateClient } from "./SparqlUpdateClient";

export class LoggingSparqlBaseClient<
  DelegateT extends
    | SparqlGraphStoreClient
    | SparqlQueryClient
    | SparqlUpdateClient,
> {
  protected delegate: DelegateT;
  protected logger: Logger;

  constructor({ delegate, logger }: { delegate: DelegateT; logger: Logger }) {
    this.delegate = delegate;
    this.logger = logger;
  }
}
