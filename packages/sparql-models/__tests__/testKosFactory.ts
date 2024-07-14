import * as mem from "@kos-kit/mem-models";
import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Concept, ConceptScheme, HttpSparqlClient, Kos } from "..";
import { DefaultModelFetcher } from "../DefaultModelFetcher.js";

export const testKosFactory = (includeLanguageTag: LanguageTag) => {
  const includeLanguageTags = new LanguageTagSet(includeLanguageTag, "");
  const sparqlClient = new HttpSparqlClient({
    endpointUrl: "http://localhost:7878/sparql",
    operation: "postDirect",
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
  //         "test-data",
  //         "unesco-thesaurus.nt",
  //       ),
  //     )
  //     .toString(),
  //   { format: "nt" },
  // );
  // const sparqlClient = new OxigraphSparqlClient(store);
  return new Kos({
    modelFetcher: new DefaultModelFetcher({
      conceptConstructor: Concept,
      conceptSchemeConstructor: ConceptScheme,
      includeLanguageTags,
      memModelFactory: new mem.DefaultModelFactory({
        conceptConstructor: mem.Concept,
        conceptSchemeConstructor: mem.ConceptScheme,
        includeLanguageTags,
        labelConstructor: mem.Label,
      }),
      sparqlClient,
    }),
    sparqlClient,
  });
};
