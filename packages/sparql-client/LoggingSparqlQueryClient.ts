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

  async queryBindings(
    query: string,
  ): Promise<readonly Record<string, BlankNode | Literal | NamedNode>[]> {
    this.logger.debug("queryBindings:\n%s", query);
    const result = await this.delegate.queryBindings(query);
    this.logger.debug(
      "queryBindings results:\n%s",
      JSON.stringify(result, undefined, 2),
    );
    return result;
  }

  async queryBoolean(query: string): Promise<boolean> {
    this.logger.debug("queryBoolean:\n%s", query);
    const result = await this.delegate.queryBoolean(query);
    this.logger.debug("queryBoolean result: %s", result);
    return result;
  }

  async queryDataset(query: string): Promise<DatasetCore> {
    this.logger.debug("queryQuads:\n%s", query);
    const result = await this.delegate.queryDataset(query);
    this.logger.debug("queryQuads result: %d quads", result.size);
    return result;
  }
}
