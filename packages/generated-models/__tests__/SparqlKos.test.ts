import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LanguageTag } from "@kos-kit/models";
import { OxigraphSparqlClient } from "@kos-kit/sparql-client";
import * as oxigraph from "oxigraph";
import { describe } from "vitest";
import { ModelFactories } from "../ModelFactories.js";
import { SparqlKos } from "../SparqlKos.js";
import { OxigraphDatasetCore } from "./OxigraphDatasetCore.js";
import { behavesLikeUnescoThesaurusKos } from "./behavesLikeUnescoThesaurusKos.js";

describe("SparqlKos", () => {
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

  behavesLikeUnescoThesaurusKos(
    (languageIn: LanguageTag) =>
      new SparqlKos({
        datasetCoreFactory: {
          dataset: (quads) =>
            new OxigraphDatasetCore(new oxigraph.Store(quads)),
        },
        languageIn: [languageIn, ""],
        modelFactories: ModelFactories.default_,
        sparqlQueryClient,
      }),
  );
});
