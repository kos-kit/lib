import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { DefaultKos, HttpSparqlClient } from "..";

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
  return new DefaultKos({
    includeLanguageTags,
    sparqlClient,
  });
};
