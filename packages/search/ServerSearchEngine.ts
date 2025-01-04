import {
  Label,
  LanguageTag,
  ModelFactories,
  RdfjsDatasetKos,
} from "@kos-kit/generated-models";
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
    const kos = new RdfjsDatasetKos({
      dataset: store,
      languageIn: [params.languageTag, ""],
      modelFactories: ModelFactories.default_,
    });

    const page: SearchResult[] = [];

    for (const conceptStub of kos.conceptStubsSync({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      (await conceptStub.resolve()).ifRight((concept) => {
        const prefLabels = concept.labels({ types: [Label.Type.PREFERRED] });
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

    for (const conceptSchemeStub of kos.conceptSchemeStubsSync({
      limit: null,
      offset: 0,
      query: { type: "All" },
    }))
      (await conceptSchemeStub.resolve()).ifRight((conceptScheme) => {
        const prefLabels = conceptScheme.labels({
          types: [Label.Type.PREFERRED],
        });
        if (prefLabels.length === 0) {
          return;
        }
        page.push({
          identifier: Resource.Identifier.toString(conceptScheme.identifier),
          prefLabel: prefLabels[0].literalForm.value,
          type: "ConceptScheme",
        });
      });

    return { page, total };
  }

  toJson(): SearchEngineJson {
    return {
      endpoint: this.endpoint,
      type: "Server",
    };
  }
}
