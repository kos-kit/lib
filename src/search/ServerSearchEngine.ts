import axios, { AxiosInstance } from "axios";

import { SearchEngine } from "./SearchEngine";
import { SearchEngineJson } from "./SearchEngineJson";
import { SearchResult } from "./SearchResult";
import { Kos as RdfJsKos } from "../models/rdfjs/Kos";
import { Parser, Store } from "n3";

/**
 * A SearchEngine implementation that makes HTTP requests to a kos-kit/server search endpoint.
 */
export class ServerSearchEngine implements SearchEngine {
  private axios: AxiosInstance;

  constructor(private readonly endpoint: string) {
    this.axios = axios.create();
  }

  async search(params: {
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]> {
    const response = await this.axios.get(`${this.endpoint}`, {
      params,
    });

    const parser = new Parser({ format: "N-Triples" });
    const store = new Store();
    store.addQuads(parser.parse(response.data));
    const kos = new RdfJsKos(store);

    const results: SearchResult[] = [];

    for await (const concept of kos.concepts()) {
      const prefLabels = await concept.prefLabels();
      if (prefLabels.length === 0) {
        continue;
      }
      results.push({
        identifier: concept.identifier.value,
        prefLabel: prefLabels[0].literalForm.value,
        type: "Concept",
      });
    }

    for (const conceptScheme of await kos.conceptSchemes()) {
      const prefLabels = await conceptScheme.prefLabels();
      if (prefLabels.length === 0) {
        continue;
      }
      results.push({
        identifier: conceptScheme.identifier.value,
        prefLabel: prefLabels[0].literalForm.value,
        type: "ConceptScheme",
      });
    }

    return results;
  }

  async searchCount(params: { query: string }): Promise<number> {
    const response = await this.axios.get(`${this.endpoint}`, {
      params,
    });
    return parseInt(response.headers["X-Total-Count"]);
  }

  toJson(): SearchEngineJson {
    return {
      endpoint: this.endpoint,
      type: "Server",
    };
  }
}
