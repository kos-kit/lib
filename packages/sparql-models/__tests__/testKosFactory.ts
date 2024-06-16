import { LanguageTag } from "../../../src/models/LanguageTag";
import { LanguageTagSet } from "../../../src/models/LanguageTagSet";
import { Kos } from "../src/Kos";
import { SparqlClient } from "../src/SparqlClient";

export const testKosFactory = (includeLanguageTag: LanguageTag) =>
  new Kos({
    includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
    sparqlClient: new SparqlClient({
      endpointUrl: "http://localhost:7878/sparql",
    }),
  });
