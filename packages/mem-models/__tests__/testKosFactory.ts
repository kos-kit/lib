import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Parser, Store } from "n3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Concept } from "../Concept.js";
import { ConceptScheme } from "../ConceptScheme.js";
import { DefaultModelFactory } from "../DefaultModelFactory.js";
import { Kos } from "../Kos.js";
import { Label } from "../Label.js";

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
        "test-data",
        "unesco-thesaurus.nt",
      ),
    )
    .toString(),
);

export const testKosFactory = (includeLanguageTag: LanguageTag) =>
  new Kos({
    dataset: testDataset,
    modelFactory: new DefaultModelFactory({
      conceptConstructor: Concept,
      conceptSchemeConstructor: ConceptScheme,
      includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
      labelConstructor: Label,
    }),
  });
