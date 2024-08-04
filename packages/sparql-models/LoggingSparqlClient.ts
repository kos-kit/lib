import { DatasetCore } from "@rdfjs/types";
import { Logger } from "pino";
import { ResultRow } from "sparql-http-client/ResultParser";
import { SparqlClient } from "./SparqlClient.js";

/**
 * SparqlClient implementation that logs queries and delegates actual work to another SparqlClient implementation.
 */
export class LoggingSparqlClient implements SparqlClient {
  readonly query: SparqlClient.Query;
  readonly update: SparqlClient.Update;

  constructor({
    delegate,
    logger,
  }: { delegate: SparqlClient; logger: Logger }) {
    this.query = {
      async ask(query: string): Promise<boolean> {
        logger.debug("SPARQL ASK:\n%s", query);
        const result = await delegate.query.ask(query);
        logger.debug("SPARQL ASK result: %s", result);
        return result;
      },
      async construct(query: string): Promise<DatasetCore> {
        logger.debug("SPARQL CONSTRUCT:\n%s", query);
        const result = await delegate.query.construct(query);
        logger.debug("SPARQL CONSTRUCT result: %d quads", result.size);
        return result;
      },
      async select(query: string): Promise<readonly ResultRow[]> {
        logger.debug("SPARQL SELECT:\n%s", query);
        const result = await delegate.query.select(query);
        logger.debug(
          "SPARQL SELECT results:\n%s",
          JSON.stringify(result, undefined, 2),
        );
        return result;
      },
    };
    this.update = {
      async update(query: string): Promise<void> {
        logger.debug("SPARQL UPDATE:\n%s", query);
        await delegate.update.update(query);
        logger.debug("SPARQL UPDATE executed successfully");
      },
    };
  }
}
