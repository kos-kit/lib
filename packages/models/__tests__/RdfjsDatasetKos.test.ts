import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatasetCore } from "@rdfjs/types";
import { Parser, Store } from "n3";
import { describe } from "vitest";
import { LanguageTag } from "../LanguageTag.js";
import { ModelFactories } from "../ModelFactories.js";
import { RdfjsDatasetKos } from "../RdfjsDatasetKos.js";
import { behavesLikeSyntheticKos } from "./behavesLikeSyntheticKos.js";
import { behavesLikeUnescoThesaurusKos } from "./behavesLikeUnescoThesaurusKos.js";

function parseRdfString(input: string): Store {
  const parser = new Parser();
  const store = new Store();
  store.addQuads(parser.parse(input));
  return store;
}

describe("RdfjsDatasetKos", () => {
  const syntheticDataset: Store = parseRdfString(
    fs
      .readFileSync(
        path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          "..",
          "..",
          "..",
          "__tests__",
          "data",
          "synthetic.ttl",
        ),
      )
      .toString(),
  );

  const kosFactoryFactory =
    (dataset: DatasetCore) => (languageIn: LanguageTag) =>
      new RdfjsDatasetKos({
        dataset: dataset,
        languageIn: [languageIn, ""],
        modelFactories: ModelFactories.default_,
      });

  behavesLikeSyntheticKos(kosFactoryFactory(syntheticDataset));

  const unescoThesaurusDataset: Store = parseRdfString(
    fs
      .readFileSync(
        path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          "..",
          "..",
          "..",
          "__tests__",
          "data",
          "unesco-thesaurus.nt",
        ),
      )
      .toString(),
  );

  behavesLikeUnescoThesaurusKos(kosFactoryFactory(unescoThesaurusDataset));
});
