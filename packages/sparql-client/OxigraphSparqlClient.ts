import { datasetCoreFactory } from "@/lib/datasetCoreFactory";
import {
  SparqlGraphStoreClient,
  SparqlQueryClient,
  SparqlUpdateClient,
} from "@kos-kit/sparql-client";
import {
  BlankNode,
  DatasetCore,
  DefaultGraph,
  Literal,
  NamedNode,
  Quad,
  Term,
} from "@rdfjs/types";
import * as oxigraph from "oxigraph";

export class OxigraphSparqlClient
  implements SparqlGraphStoreClient, SparqlQueryClient, SparqlUpdateClient
{
  private readonly useDefaultGraphAsUnion: boolean;

  constructor(
    private readonly delegate: oxigraph.Store,
    options?: { useDefaultGraphAsUnion?: boolean },
  ) {
    this.useDefaultGraphAsUnion = !!options?.useDefaultGraphAsUnion;
  }

  async deleteGraph(graph: DefaultGraph | NamedNode): Promise<void> {
    // https://www.w3.org/TR/2013/REC-sparql11-http-rdf-update-20130321/#http-put
    if (graph.termType === "DefaultGraph") {
      this.delegate.update("DROP SILENT DEFAULT;");
    } else {
      this.delegate.update(`DROP SILENT GRAPH <${graph.value}>;`);
    }
  }

  async getGraph(graph: DefaultGraph | NamedNode): Promise<DatasetCore> {
    const dataset = datasetCoreFactory.dataset();
    for (const quad of this.delegate.match(null, null, null, graph)) {
      dataset.add(quad);
    }
    return dataset;
  }

  async queryBindings(
    query: string,
  ): Promise<readonly Record<string, BlankNode | Literal | NamedNode>[]> {
    const bindings: Record<string, BlankNode | Literal | NamedNode>[] = [];
    for (const map of this.delegate.query(query, {
      use_default_graph_as_union: this.useDefaultGraphAsUnion,
    }) as Map<string, Term>[]) {
      const mapBindings: Record<string, BlankNode | Literal | NamedNode> = {};
      for (const entry of map.entries()) {
        switch (entry[1].termType) {
          case "BlankNode":
          case "Literal":
          case "NamedNode":
            mapBindings[entry[0]] = entry[1];
            break;
          default:
            throw new RangeError(entry[1].termType);
        }
      }
      bindings.push(mapBindings);
    }
    return bindings;
  }

  async queryBoolean(query: string): Promise<boolean> {
    return this.delegate.query(query, {
      use_default_graph_as_union: this.useDefaultGraphAsUnion,
    }) as boolean;
  }

  async queryDataset(query: string): Promise<DatasetCore> {
    return datasetCoreFactory.dataset(
      this.delegate.query(query, {
        use_default_graph_as_union: this.useDefaultGraphAsUnion,
      }) as Quad[],
    );
  }

  async postGraph(
    graph: DefaultGraph | NamedNode,
    payload: Iterable<Quad>,
  ): Promise<void> {
    for (const quad of payload) {
      this.delegate.add(
        oxigraph.quad(quad.subject, quad.predicate, quad.object, graph),
      );
    }
  }

  async putGraph(
    graph: DefaultGraph | NamedNode,
    payload: Iterable<Quad>,
  ): Promise<void> {
    await this.deleteGraph(graph);
    await this.postGraph(graph, payload);
  }

  async update(update: string) {
    this.delegate.update(update, {});
  }
}
