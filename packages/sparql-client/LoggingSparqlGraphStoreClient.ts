import {
  BlankNode,
  DatasetCore,
  DefaultGraph,
  NamedNode,
  Quad,
} from "@rdfjs/types";
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

  async deleteGraph(
    graph: BlankNode | DefaultGraph | NamedNode,
  ): Promise<void> {
    this.logger.debug("deleting graph %s", this.loggableGraph(graph));
    await this.delegate.deleteGraph(graph);
    this.logger.debug("deleted graph %s", this.loggableGraph(graph));
  }

  async getGraph(
    graph: BlankNode | DefaultGraph | NamedNode,
  ): Promise<readonly Quad[]> {
    this.logger.debug("getting dataset from %s", this.loggableGraph(graph));
    const result = await this.delegate.getGraph(graph);
    this.logger.debug(
      "got %d-quad dataset from %s",
      result.length,
      this.loggableGraph(graph),
    );
    return result;
  }

  async postGraph(
    graph: BlankNode | DefaultGraph | NamedNode,
    payload: DatasetCore,
  ): Promise<void> {
    this.logger.debug(
      "posting %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(graph),
    );
    await this.delegate.putGraph(graph, payload);
    this.logger.debug(
      "posted %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(graph),
    );
  }

  async putGraph(
    graph: BlankNode | DefaultGraph | NamedNode,
    payload: DatasetCore,
  ): Promise<void> {
    this.logger.debug(
      "putting %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(graph),
    );
    await this.delegate.putGraph(graph, payload);
    this.logger.debug(
      "put %d-quad dataset from %s",
      payload.size,
      this.loggableGraph(graph),
    );
  }

  private loggableGraph(graph: BlankNode | DefaultGraph | NamedNode) {
    switch (graph.termType) {
      case "BlankNode":
        return `graph _:${graph.value}`;
      case "DefaultGraph":
        return "default graph";
      case "NamedNode":
        return `graph <${graph.value}>`;
    }
  }
}
