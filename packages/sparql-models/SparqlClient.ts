import { DatasetCore, Quad } from "@rdfjs/types";
import { ParsingQuery, QueryOptions } from "sparql-http-client";
import ParsingSparqlClient from "sparql-http-client/ParsingClient";
import { ResultRow } from "sparql-http-client/ResultParser";
import { Writer } from "n3";
import { logger } from "./logger.js";

class Query implements ParsingQuery<DatasetCore<Quad, Quad>> {
  constructor(
    private readonly delegate: ParsingQuery<DatasetCore<Quad, Quad>>,
  ) {}

  ask(query: string, options?: QueryOptions | undefined): Promise<boolean> {
    return this.delegate.ask(query, options);
  }

  async construct(
    query: string,
    options?: QueryOptions | undefined,
  ): Promise<DatasetCore<Quad, Quad>> {
    logger.trace("CONSTRUCT query:\n%s", query);
    const resultDataset = await this.delegate.construct(query, options);
    if (logger.isLevelEnabled("trace")) {
      const resultDatasetString = new Writer({
        format: "Turtle",
      }).quadsToString([...resultDataset]);
      logger.trace("CONSTRUCT query result:\n%s", resultDatasetString);
    }
    return resultDataset;
  }

  async select(
    query: string,
    options?: QueryOptions | undefined,
  ): Promise<ResultRow[]> {
    logger.trace("SELECT query:\n%s", query);
    const resultRows = await this.delegate.select(query, options);
    if (logger.isLevelEnabled("trace")) {
      const resultRowsString = JSON.stringify(resultRows);
      logger.trace("SELECT query result:\n%s", resultRowsString);
    }
    return resultRows;
  }

  update(query: string, options?: QueryOptions | undefined): Promise<void> {
    return this.delegate.update(query, options);
  }
}

export class SparqlClient {
  readonly query: Query;

  constructor({ endpointUrl }: { endpointUrl: string }) {
    this.query = new Query(new ParsingSparqlClient({ endpointUrl }).query);
  }
}
