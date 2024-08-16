import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Logger } from "pino";
import { SparqlQueryClient } from "./SparqlQueryClient.js";

/**
 * SparqlClient implementation that logs queries and delegates actual work to another SparqlClient implementation.
 */
export class LoggingSparqlQueryClient implements SparqlQueryClient {
  private delegate: SparqlQueryClient;
  private logger: Logger;

  constructor({
    delegate,
    logger,
  }: { delegate: SparqlQueryClient; logger: Logger }) {
    this.delegate = delegate;
    this.logger = logger;
  }

  async ask(query: string): Promise<boolean> {
    this.logger.debug("SPARQL ASK:\n%s", query);
    const result = await this.delegate.ask(query);
    this.logger.debug("SPARQL ASK result: %s", result);
    return result;
  }

  async construct(query: string): Promise<DatasetCore> {
    this.logger.debug("SPARQL CONSTRUCT:\n%s", query);
    const result = await this.delegate.construct(query);
    this.logger.debug("SPARQL CONSTRUCT result: %d quads", result.size);
    return result;
  }

  async select(
    query: string,
  ): Promise<readonly Record<string, BlankNode | Literal | NamedNode>[]> {
    this.logger.debug("SPARQL SELECT:\n%s", query);
    const result = await this.delegate.select(query);
    this.logger.debug(
      "SPARQL SELECT results:\n%s",
      JSON.stringify(result, undefined, 2),
    );
    return result;
  }
}
