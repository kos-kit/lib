import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { OxigraphSparqlClient } from "@kos-kit/sparql-client";
import * as oxigraph from "oxigraph";
import { DefaultKos } from "../DefaultKos.js";
import { OxigraphDatasetCore } from "./OxigraphDatasetCore.js";

// const sparqlQueryClient = new HttpSparqlQueryClient({
//   dataFactory: N3.DataFactory,
//   endpointUrl: "http://localhost:7878/sparql",
//   defaultRequestOptions: {
//     method: "POSTDirectly",
//   },
// });
const store = new oxigraph.Store();
store.load(
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
  { format: "nt" },
);
const sparqlQueryClient = new OxigraphSparqlClient({
  dataFactory: oxigraph,
  store,
});

export const testKosFactory = (includeLanguageTag: LanguageTag) => {
  return new DefaultKos({
    datasetCoreFactory: {
      dataset: (quads) => new OxigraphDatasetCore(new oxigraph.Store(quads)),
    },
    includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
    sparqlQueryClient,
  });
};
