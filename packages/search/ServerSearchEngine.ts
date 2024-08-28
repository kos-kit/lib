import { Label, LanguageTag, LanguageTagSet } from "@kos-kit/models";
import * as mem from "@kos-kit/rdfjs-dataset-models";
import { Parser, Store } from "n3";
import { Resource } from "rdfjs-resource";
import { SearchEngine } from "./SearchEngine.js";
import { SearchEngineJson } from "./SearchEngineJson.js";
import { SearchResult } from "./SearchResult.js";
import { SearchResults } from "./SearchResults.js";

/**
 * A SearchEngine implementation that makes HTTP requests to a kos-kit/server search endpoint.
 */
export class ServerSearchEngine implements SearchEngine {
  constructor(private readonly endpoint: string) {}

  static fromJson(json: SearchEngineJson) {
    return new ServerSearchEngine(json["endpoint"]);
  }

  async search(params: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<SearchResults> {
    const url = new URL(this.endpoint);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value.toString());
    }
    const response = await fetch(url);

    const totalHeaderValue = response.headers.get("x-total-count")!;
    const total = Number.parseInt(totalHeaderValue);

    const parser = new Parser({ format: "N-Triples" });
    const store = new Store();
    store.addQuads(parser.parse(await response.text()));
    const kos = new mem.DefaultKos({
      dataset: store,
      includeLanguageTags: new LanguageTagSet(params.languageTag, ""),
    });

    const page: SearchResult[] = [];

    for (const concept of await kos.concepts({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      (await concept.resolve()).ifRight((concept) => {
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

    for (const conceptScheme of await kos.conceptSchemes({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      (await conceptScheme.resolve()).ifRight((conceptScheme) => {
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
