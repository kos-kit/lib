import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OxigraphSparqlClient } from "@kos-kit/sparql-client";
import * as oxigraph from "oxigraph";
import { describe } from "vitest";
import { LanguageTag } from "../LanguageTag.js";
import { ModelFactories } from "../ModelFactories.js";
import { SparqlKos } from "../SparqlKos.js";
import { OxigraphDatasetCore } from "./OxigraphDatasetCore.js";
import { behavesLikeSyntheticKos } from "./behavesLikeSyntheticKos.js";
import { behavesLikeUnescoThesaurusKos } from "./behavesLikeUnescoThesaurusKos.js";

describe("SparqlKos", () => {
  const syntheticStore = new oxigraph.Store();
  syntheticStore.load(
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
    { format: "ttl" },
  );

  const kosFactoryFactory =
    (store: oxigraph.Store) => (languageIn: LanguageTag) =>
      new SparqlKos({
        datasetCoreFactory: {
          dataset: (quads) =>
            new OxigraphDatasetCore(new oxigraph.Store(quads)),
        },
        languageIn: [languageIn, ""],
        modelFactories: ModelFactories.default_,
        sparqlQueryClient: new OxigraphSparqlClient({
          dataFactory: oxigraph,
          store,
        }),
      });

  behavesLikeSyntheticKos(kosFactoryFactory(syntheticStore));

  const unescoThesaurusStore = new oxigraph.Store();
  unescoThesaurusStore.load(
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

  behavesLikeUnescoThesaurusKos(
    (languageIn: LanguageTag) =>
      new SparqlKos({
        datasetCoreFactory: {
          dataset: (quads) =>
            new OxigraphDatasetCore(new oxigraph.Store(quads)),
        },
        languageIn: [languageIn, ""],
        modelFactories: ModelFactories.default_,
        sparqlQueryClient: new OxigraphSparqlClient({
          dataFactory: oxigraph,
          store: unescoThesaurusStore,
        }),
      }),
  );
});
