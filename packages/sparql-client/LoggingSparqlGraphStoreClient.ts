import { BlankNode, DatasetCore, DefaultGraph, NamedNode } from "@rdfjs/types";
import { Logger } from "pino";
import { SparqlGraphStoreClient } from "./SparqlGraphStoreClient.js";

export class LoggingSparqlGraphStoreClient implements SparqlGraphStoreClient {
  private delegate: SparqlGraphStoreClient;
  private logger: Logger;

  constructor({
    delegate,
    logger,
  }: { delegate: SparqlGraphStoreClient; logger: Logger }) {
    this.delegate = delegate;
    this.logger = logger;
  }

  async delete(graph: BlankNode | DefaultGraph | NamedNode): Promise<void> {
    this.logger.debug("deleting graph %s", this.loggableGraph(graph));
    await this.delegate.delete(graph);
    this.logger.debug("deleted graph %s", this.loggableGraph(graph));
  }

  async getDataset(options?: {
    graph?: BlankNode | DefaultGraph | NamedNode;
  }): Promise<DatasetCore> {
    this.logger.debug(
      "getting dataset from %s",
      this.loggableGraph(options?.graph),
    );
    const result = await this.delegate.getDataset(options);
    this.logger.debug(
      "got %d-quad dataset from %s",
      result.size,
      this.loggableGraph(options?.graph),
    );
    return result;
  }

  async postDataset(
    payload: DatasetCore,
    options?: { graph?: BlankNode | DefaultGraph | NamedNode },
  ): Promise<void> {
    this.logger.debug(
      "posting %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(options?.graph),
    );
    await this.delegate.putDataset(payload, options);
    this.logger.debug(
      "posted %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(options?.graph),
    );
  }

  async putDataset(
    payload: DatasetCore,
    options?: { graph?: BlankNode | DefaultGraph | NamedNode },
  ): Promise<void> {
    this.logger.debug(
      "putting %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(options?.graph),
    );
    await this.delegate.putDataset(payload, options);
    this.logger.debug(
      "put %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(options?.graph),
    );
  }

  private loggableGraph(graph?: BlankNode | DefaultGraph | NamedNode) {
    if (!graph || graph.termType === "DefaultGraph") {
      return "default graph";
    }
    switch (graph.termType) {
      case "BlankNode":
        return `graph _:${graph.value}`;
      case "NamedNode":
        return `graph <${graph.value}>`;
    }
  }
}
