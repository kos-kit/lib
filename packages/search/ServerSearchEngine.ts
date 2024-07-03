import axios, { AxiosInstance } from "axios";

import * as mem from "@kos-kit/mem-models";
import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const totalHeaderValue = response.headers["x-total-count"];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const total = parseInt(totalHeaderValue);

    const parser = new Parser({ format: "N-Triples" });
    const store = new Store();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    store.addQuads(parser.parse(response.data));
    const kos = new mem.Kos({
      dataset: store,
      modelFactory: new mem.DefaultModelFactory({
        conceptConstructor: mem.Concept,
        conceptSchemeConstructor: mem.ConceptScheme,
        includeLanguageTags: new LanguageTagSet(params.languageTag, ""),
        labelConstructor: mem.Label,
      }),
    });

    const page: SearchResult[] = [];

    for await (const concept of kos.concepts()) {
      const prefLabels = concept.prefLabels;
      if (prefLabels.length === 0) {
        continue;
      }
      page.push({
        identifier: Resource.Identifier.toString(concept.identifier),
        prefLabel: prefLabels[0].literalForm.value,
        type: "Concept",
      });
    }

    for (const conceptScheme of await kos.conceptSchemes()) {
      const prefLabels = conceptScheme.prefLabels;
      if (prefLabels.length === 0) {
        continue;
      }
      page.push({
        identifier: Resource.Identifier.toString(conceptScheme.identifier),
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
