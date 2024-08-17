import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { HttpSparqlQueryClient } from "@kos-kit/sparql-client";
import N3 from "n3";
import { DefaultKos } from "..";

export const testKosFactory = (includeLanguageTag: LanguageTag) => {
  const includeLanguageTags = new LanguageTagSet(includeLanguageTag, "");
  const sparqlQueryClient = new HttpSparqlQueryClient({
    dataFactory: N3.DataFactory,
    datasetCoreFactory: {
      dataset: (quads) => new N3.Store(quads),
    },
    endpointUrl: "http://localhost:7878/sparql",
    defaultRequestOptions: {
      method: "POSTDirectly",
    },
  });
  // const store = new Store();
  // store.load(
  //   fs
  //     .readFileSync(
  //       path.join(
  //         path.dirname(fileURLToPath(import.meta.url)),
  //         "..",
  //         "..",
  //         "..",
  //          "__tests__",
  //         "data",
  //         "unesco-thesaurus.nt",
  //       ),
  //     )
  //     .toString(),
  //   { format: "nt" },
  // );
  // const sparqlQueryClient = new OxigraphSparqlClient(store);
  return new DefaultKos({
    includeLanguageTags,
    sparqlQueryClient,
  });
};
