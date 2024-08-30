import { DatasetCore, DefaultGraph, NamedNode, Quad } from "@rdfjs/types";
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

  async deleteGraph(graph: DefaultGraph | NamedNode): Promise<void> {
    this.logger.trace("deleting graph %s", this.loggableGraph(graph));
    await this.delegate.deleteGraph(graph);
    this.logger.trace("deleted graph %s", this.loggableGraph(graph));
  }

  async getGraph(graph: DefaultGraph | NamedNode): Promise<readonly Quad[]> {
    this.logger.trace("getting dataset from %s", this.loggableGraph(graph));
    const result = await this.delegate.getGraph(graph);
    this.logger.trace(
      "got %d quads from %s",
      result.length,
      this.loggableGraph(graph),
    );
    return result;
  }

  async postGraph(
    graph: DefaultGraph | NamedNode,
    payload: DatasetCore,
  ): Promise<void> {
    this.logger.trace(
      "posting %d-quad dataset to %s",
      payload.size,
      this.loggableGraph(graph),
    );
    await this.delegate.postGraph(graph, payload);
    this.logger.trace(
      "posted %d-quad dataset to %s",
      payload.size,
      this.loggableGraph(graph),
    );
  }

  async putGraph(
    graph: DefaultGraph | NamedNode,
    payload: DatasetCore,
  ): Promise<void> {
    this.logger.trace(
      "putting %d-quad dataset to %s",
      payload.size,
      this.loggableGraph(graph),
    );
    await this.delegate.putGraph(graph, payload);
    this.logger.trace(
      "put %d-quad dataset to %s",
      payload.size,
      this.loggableGraph(graph),
    );
  }

  private loggableGraph(graph: DefaultGraph | NamedNode) {
    switch (graph.termType) {
      case "DefaultGraph":
        return "default graph";
      case "NamedNode":
        return `graph <${graph.value}>`;
    }
  }
}
