import axios, { AxiosInstance } from "axios";

import { SearchEngine } from "./SearchEngine";
import { SearchEngineJson } from "./SearchEngineJson";
import { SearchResult } from "./SearchResult";
import { Kos as RdfJsKos } from "../models/rdfjs/Kos";
import { Parser, Store } from "n3";
import { identifierToString } from "../utilities/identifierToString";
import { LanguageTag } from "../models";
import { SearchResults } from "./SearchResults";

/**
 * A SearchEngine implementation that makes HTTP requests to a kos-kit/server search endpoint.
 */
export class ServerSearchEngine implements SearchEngine {
  private readonly axios: AxiosInstance;

  constructor(private readonly endpoint: string) {
    this.axios = axios.create();
  }

  static fromJson(json: SearchEngineJson) {
    return new ServerSearchEngine(json["endpoint"]);
  }

  async search(params: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<SearchResults> {
    const response = await this.axios.get(`${this.endpoint}`, {
      params,
    });

    const totalHeaderValue = response.headers["x-total-count"];
    const total = parseInt(totalHeaderValue);

    const parser = new Parser({ format: "N-Triples" });
    const store = new Store();
    store.addQuads(parser.parse(response.data));
    const kos = new RdfJsKos(store);

    const page: SearchResult[] = [];

    for await (const concept of kos.concepts()) {
      const prefLabels = await concept.prefLabels({
        languageTag: params.languageTag,
      });
      if (prefLabels.length === 0) {
        continue;
      }
      page.push({
        identifier: identifierToString(concept.identifier),
        prefLabel: prefLabels[0].literalForm.value,
        type: "Concept",
      });
    }

    for (const conceptScheme of await kos.conceptSchemes()) {
      const prefLabels = await conceptScheme.prefLabels({
        languageTag: params.languageTag,
      });
      if (prefLabels.length === 0) {
        continue;
      }
      page.push({
        identifier: identifierToString(conceptScheme.identifier),
        prefLabel: prefLabels[0].literalForm.value,
        type: "ConceptScheme",
      });
    }

    return { page, total };
  }

  toJson(): SearchEngineJson {
    return {
      endpoint: this.endpoint,
      type: "Server",
    };
  }
}
