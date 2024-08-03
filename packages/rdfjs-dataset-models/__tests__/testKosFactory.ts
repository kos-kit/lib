import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Parser, Store } from "n3";
import { DefaultKos } from "../DefaultKos.js";

const ntriplesStringToDataset = (input: string): Store => {
  const parser = new Parser({ format: "N-Triples" });
  const store = new Store();
  store.addQuads(parser.parse(input));
  return store;
};

const testDataset: Store = ntriplesStringToDataset(
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

export const testKosFactory = (includeLanguageTag: LanguageTag) =>
  new DefaultKos({
    dataset: testDataset,
    includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
  });
