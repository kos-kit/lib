import { Logger } from "pino";
import { SparqlUpdateClient } from "./SparqlUpdateClient.js";

/**
 * SparqlClient implementation that logs queries and delegates actual work to another SparqlClient implementation.
 */
export class LoggingSparqlUpdateClient implements SparqlUpdateClient {
  private delegate: SparqlUpdateClient;
  private logger: Logger;

  constructor({
    delegate,
    logger,
  }: { delegate: SparqlUpdateClient; logger: Logger }) {
    this.delegate = delegate;
    this.logger = logger;
  }

  async update(update: string): Promise<void> {
    this.logger.trace("SPARQL update:\n%s", update);
    await this.delegate.update(update);
    this.logger.trace("SPARQL update executed successfully");
  }
}
