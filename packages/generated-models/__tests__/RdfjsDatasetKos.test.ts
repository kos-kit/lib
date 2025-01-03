import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LanguageTag } from "@kos-kit/models";
import { Parser, Store } from "n3";
import { describe } from "vitest";
import { RdfjsDatasetKos } from "../RdfjsDatasetKos.js";
import { RdfjsModelFactory } from "../RdfjsModelFactory.js";
import { behavesLikeUnescoThesaurusKos } from "./behavesLikeUnescoThesaurusKos.js";

const ntriplesStringToDataset = (input: string): Store => {
  const parser = new Parser({ format: "N-Triples" });
  const store = new Store();
  store.addQuads(parser.parse(input));
  return store;
};

describe("RdfjsDatasetKos", () => {
  const unescoThesaurusDataset: Store = ntriplesStringToDataset(
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

  behavesLikeUnescoThesaurusKos(
    (languageIn: LanguageTag) =>
      new RdfjsDatasetKos({
        dataset: unescoThesaurusDataset,
        languageIn: [languageIn, ""],
        modelFactory: RdfjsModelFactory.default_,
      }),
  );
});
