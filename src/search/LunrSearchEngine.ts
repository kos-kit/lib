import lunr, { Index } from "lunr";
import { SearchEngine } from "./SearchEngine";
import { LanguageTag } from "../models/LanguageTag";
import { Kos } from "../models/Kos";
import { SearchResult } from "./SearchResult";
import { LabeledModel } from "../models/LabeledModel";
import { Identifier } from "../models/Identifier";
import { identifierToString } from "../utilities/identifierToString";
import { SearchEngineJson } from "./SearchEngineJson";
import { LunrIndexCompactor } from "./LunrIndexCompactor";
import { SearchResults } from "./SearchResults";

/**
 * A SearchEngine implementation built with Lunr.js, so it can be used in the browser.
 */
export class LunrSearchEngine implements SearchEngine {
  private constructor(
    private readonly documents: Record<string, Record<string, string>>, // type -> identifier -> prefLabel
    private readonly index: Index,
    private readonly languageTag: LanguageTag,
  ) {}

  static async create({
    conceptsLimit,
    languageTag,
    kos,
  }: {
    conceptsLimit?: number;
    languageTag: LanguageTag;
    kos: Kos;
  }): Promise<LunrSearchEngine> {
    type IndexDocument = {
      readonly identifier: string;
      readonly joinedLabels: string;
      readonly prefLabel: string;
      readonly type: SearchResult["type"];
    };

    const toIndexDocument = async (
      model: LabeledModel & { identifier: Identifier },
      type: SearchResult["type"],
    ): Promise<IndexDocument | null> => {
      const prefLabels = model.prefLabels;
      if (prefLabels.length === 0) {
        return null;
      }
      const altLabels = model.altLabels;
      const hiddenLabels = model.hiddenLabels;

      const identifierString = identifierToString(model.identifier);

      return {
        identifier: identifierString,
        joinedLabels: [altLabels, hiddenLabels, prefLabels]
          .flatMap((labels) => labels.map((label) => label.literalForm.value))
          .join(" "),
        prefLabel: prefLabels[0].literalForm.value,
        type,
      };
    };

    const indexDocumentPromises: Promise<IndexDocument | null>[] = [];

    if (conceptsLimit != null) {
      // Don't index all concepts in the set, in testing
      for (const concept of await kos.conceptsPage({
        limit: conceptsLimit,
        offset: 0,
      })) {
        indexDocumentPromises.push(toIndexDocument(concept, "Concept"));
      }
    } else {
      // Index all concepts in the set
      for await (const concept of await kos.concepts()) {
        indexDocumentPromises.push(toIndexDocument(concept, "Concept"));
      }
    }

    // Index concept schemes
    indexDocumentPromises.push(
      ...(await kos.conceptSchemes()).map((conceptScheme) =>
        toIndexDocument(conceptScheme, "ConceptScheme"),
      ),
    );

    const indexDocuments = await Promise.all(indexDocumentPromises);

    const compactIndexDocuments: Record<string, Record<string, string>> = {};
    const index = lunr(function () {
      this.ref("identifier");
      this.field("joinedLabels");
      for (const indexDocument of indexDocuments) {
        if (indexDocument === null) {
          continue;
        }
        this.add(indexDocument);

        let compactIndexDocumentsByIdentifier =
          compactIndexDocuments[indexDocument.type];
        if (!compactIndexDocumentsByIdentifier) {
          compactIndexDocumentsByIdentifier = compactIndexDocuments[
            indexDocument.type
          ] = {};
        }
        compactIndexDocumentsByIdentifier[indexDocument.identifier] =
          indexDocument.prefLabel;
      }
    });

    return new LunrSearchEngine(compactIndexDocuments, index, languageTag);
  }

  static fromJson(json: SearchEngineJson) {
    const lunrIndexCompactor = new LunrIndexCompactor();
    return new LunrSearchEngine(
      json["documents"],
      lunrIndexCompactor.expandLunrIndex(json["index"]),
      json["languageTag"],
    );
  }

  search({
    languageTag,
    limit,
    offset,
    query,
  }: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<SearchResults> {
    return new Promise((resolve) => {
      if (languageTag !== this.languageTag) {
        throw new RangeError(
          `expected language tag '${this.languageTag}', actual '${this.languageTag}`,
        );
      }

      const indexResults = this.index.search(query);

      const page: SearchResult[] = [];
      for (const indexResult of indexResults.slice(offset)) {
        for (const documentType of Object.keys(this.documents)) {
          const documentPrefLabel =
            this.documents[documentType][indexResult.ref];

          if (!documentPrefLabel) {
            continue;
          }

          page.push({
            identifier: indexResult.ref,
            prefLabel: documentPrefLabel,
            type: documentType as SearchResult["type"],
          });
          if (page.length === limit) {
            resolve({ page, total: indexResults.length });
            return;
          }
          break;
        }
      }
      resolve({ page, total: indexResults.length });
    });
  }

  toJson(): SearchEngineJson {
    const lunrIndexCompactor = new LunrIndexCompactor();
    return {
      documents: this.documents,
      index: lunrIndexCompactor.compactLunrIndex(this.index),
      languageTag: this.languageTag,
      type: "Lunr",
    };
  }
}
