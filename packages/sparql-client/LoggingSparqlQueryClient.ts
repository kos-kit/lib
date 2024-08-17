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

  async queryBoolean(query: string): Promise<boolean> {
    this.logger.debug("SPARQL ASK:\n%s", query);
    const result = await this.delegate.queryBoolean(query);
    this.logger.debug("SPARQL ASK result: %s", result);
    return result;
  }

  async queryQuads(query: string): Promise<DatasetCore> {
    this.logger.debug("SPARQL CONSTRUCT:\n%s", query);
    const result = await this.delegate.queryQuads(query);
    this.logger.debug("SPARQL CONSTRUCT result: %d quads", result.size);
    return result;
  }

  async queryBindings(
    query: string,
  ): Promise<readonly Record<string, BlankNode | Literal | NamedNode>[]> {
    this.logger.debug("SPARQL SELECT:\n%s", query);
    const result = await this.delegate.queryBindings(query);
    this.logger.debug(
      "SPARQL SELECT results:\n%s",
      JSON.stringify(result, undefined, 2),
    );
    return result;
  }
}
