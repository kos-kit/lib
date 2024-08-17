import {
  DataFactory,
  DatasetCore,
  DatasetCoreFactory,
  DefaultGraph,
  NamedNode,
  Quad,
} from "@rdfjs/types";
import N3 from "n3";
import { HttpSparqlBaseClient } from "./HttpSparqlBaseClient.js";
import { SparqlGraphStoreClient } from "./SparqlGraphStoreClient.js";

export class HttpSparqlGraphStoreClient
  extends HttpSparqlBaseClient<HttpSparqlGraphStoreClient.RequestOptions>
  implements SparqlGraphStoreClient
{
  private readonly dataFactory: DataFactory;
  private readonly datasetCoreFactory: DatasetCoreFactory;

  constructor({
    dataFactory,
    datasetCoreFactory,
    ...superParameters
  }: HttpSparqlGraphStoreClient.Parameters) {
    super(superParameters);
    this.dataFactory = dataFactory;
    this.datasetCoreFactory = datasetCoreFactory;
  }

  async deleteGraph(
    graph: DefaultGraph | NamedNode,
    options?: HttpSparqlGraphStoreClient.RequestOptions,
  ): Promise<void> {
    await this.fetch(this.graphUrl(graph), {
      headers: this.requestHeaders({}, options),
      method: "DELETE",
    });
  }

  async getGraph(
    graph: DefaultGraph | NamedNode,
    options?: HttpSparqlGraphStoreClient.RequestOptions,
  ): Promise<DatasetCore> {
    const response = await this.fetch(this.graphUrl(graph), {
      headers: this.requestHeaders(
        {
          accept: "application/n-triples; charset=utf-8",
        },
        options,
      ),
      method: "GET",
    });
    return this.datasetCoreFactory.dataset(
      new N3.Parser({
        factory: this.dataFactory,
        format: "application/n-triples",
      }).parse(await response.text()),
    );
  }

  async postGraph(
    graph: DefaultGraph | NamedNode,
    payload: Iterable<Quad>,
    options?: HttpSparqlGraphStoreClient.RequestOptions,
  ): Promise<void> {
    return this.postOrPutGraph(graph, "POST", payload, options);
  }

  async putGraph(
    graph: DefaultGraph | NamedNode,
    payload: Iterable<Quad>,
    options?: HttpSparqlGraphStoreClient.RequestOptions,
  ): Promise<void> {
    return this.postOrPutGraph(graph, "PUT", payload, options);
  }

  private graphUrl(graph: DefaultGraph | NamedNode): URL {
    const url = new URL(this.endpointUrl);
    switch (graph.termType) {
      case "DefaultGraph":
        url.searchParams.append("default", "");
        break;
      case "NamedNode":
        url.searchParams.append("graph", graph.value);
        break;
    }
    return url;
  }

  private async postOrPutGraph(
    graph: DefaultGraph | NamedNode,
    method: "POST" | "PUT",
    payload: Iterable<Quad>,
    options?: HttpSparqlGraphStoreClient.RequestOptions,
  ): Promise<void> {
    // Strip named graphs out of the payload quads, since everything should go to the same graph.
    const quads: Quad[] = [];
    for (const quad of payload) {
      if (quad.graph.termType === "DefaultGraph") {
        quads.push(quad);
      } else {
        quads.push(
          this.dataFactory.quad(quad.subject, quad.predicate, quad.object),
        );
      }
    }

    await this.fetch(this.graphUrl(graph), {
      body: new N3.Writer({
        format: "application/n-triples",
      })
        .quadsToString(quads)
        .trimEnd(),
      headers: this.requestHeaders(
        {
          contentType: "application/n-triples; charset=utf-8",
        },
        options,
      ),
      method,
    });
  }
}

export namespace HttpSparqlGraphStoreClient {
  export interface Parameters
    extends HttpSparqlBaseClient.Parameters<RequestOptions> {
    dataFactory: DataFactory;
    datasetCoreFactory: DatasetCoreFactory;
  }

  export type RequestOptions = HttpSparqlBaseClient.RequestOptions;
}
