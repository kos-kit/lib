import axios, { AxiosInstance } from "axios";

import { Label, LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import * as mem from "@kos-kit/rdfjs-dataset-models";
import { Parser, Store } from "n3";
import { SearchEngine } from "./SearchEngine.js";
import { SearchEngineJson } from "./SearchEngineJson.js";
import { SearchResult } from "./SearchResult.js";
import { SearchResults } from "./SearchResults.js";

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
    const response = await this.axios.get(this.endpoint, {
      params,
    });

    const totalHeaderValue = response.headers["x-total-count"];
    const total = Number.parseInt(totalHeaderValue);

    const parser = new Parser({ format: "N-Triples" });
    const store = new Store();
    store.addQuads(parser.parse(response.data));
    const kos = new mem.DefaultKos({
      dataset: store,
      includeLanguageTags: new LanguageTagSet(params.languageTag, ""),
    });

    const page: SearchResult[] = [];

    for await (const concept of kos.concepts({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      (await concept.resolve()).ifJust((concept) => {
        const prefLabels = concept.labels(Label.Type.PREFERRED);
        if (prefLabels.length === 0) {
          return;
        }
        page.push({
          identifier: Resource.Identifier.toString(concept.identifier),
          prefLabel: prefLabels[0].literalForm.value,
          type: "Concept",
        });
      });
    }

    for await (const conceptScheme of kos.conceptSchemes({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      (await conceptScheme.resolve()).ifJust((conceptScheme) => {
        const prefLabels = conceptScheme.labels(Label.Type.PREFERRED);
        if (prefLabels.length === 0) {
          return;
        }
        page.push({
          identifier: Resource.Identifier.toString(conceptScheme.identifier),
          prefLabel: prefLabels[0].literalForm.value,
          type: "ConceptScheme",
        });
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
