import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Kos, SparqlClient } from "../src";

export const testKosFactory = (includeLanguageTag: LanguageTag) =>
  new Kos({
    includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
    sparqlClient: new SparqlClient({
      endpointUrl: "http://localhost:7878/sparql",
    }),
  });
