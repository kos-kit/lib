import { Kos } from "../../../src/models/mem/Kos";
import { Parser, Store } from "n3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { LanguageTagSet } from "../../../src/models/LanguageTagSet";
import { LanguageTag } from "../../../src/models/LanguageTag";

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