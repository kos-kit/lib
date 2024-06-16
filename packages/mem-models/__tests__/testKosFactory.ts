import { Parser, Store } from "n3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Kos } from "../src/Kos";

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
        "models",
        "__tests__",
        "unesco-thesaurus.nt",
      ),
    )
    .toString(),
);

export const testKosFactory = (includeLanguageTag: LanguageTag) =>
  new Kos({
    dataset: testDataset,
    includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
  });
