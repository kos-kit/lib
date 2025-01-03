import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LanguageTag } from "@kos-kit/models";
import { Parser, Store } from "n3";
import { describe } from "vitest";
import { ModelFactories } from "../ModelFactories.js";
import { RdfjsDatasetKos } from "../RdfjsDatasetKos.js";
import { behavesLikeSyntheticKos } from "./behavesLikeSyntheticKos.js";

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

  behavesLikeSyntheticKos(
    (languageIn: LanguageTag) =>
      new RdfjsDatasetKos({
        dataset: syntheticDataset,
        languageIn: [languageIn, ""],
        modelFactories: ModelFactories.default_,
      }),
  );

  // const unescoThesaurusDataset: Store = parseRdfString(
  //   fs
  //     .readFileSync(
  //       path.join(
  //         path.dirname(fileURLToPath(import.meta.url)),
  //         "..",
  //         "..",
  //         "..",
  //         "__tests__",
  //         "data",
  //         "unesco-thesaurus.nt",
  //       ),
  //     )
  //     .toString(),
  // );
  //
  // behavesLikeUnescoThesaurusKos(
  //   (languageIn: LanguageTag) =>
  //     new RdfjsDatasetKos({
  //       dataset: unescoThesaurusDataset,
  //       languageIn: [languageIn, ""],
  //       modelFactories: ModelFactories.default_,
  //     }),
  // );
});
