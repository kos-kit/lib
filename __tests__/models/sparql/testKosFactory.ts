import { LanguageTag } from "../../../src/models";
import { LanguageTagSet } from "../../../src/models/LanguageTagSet";
import { Kos } from "../../../src/models/sparql/Kos";
import SparqlClient from "sparql-http-client/ParsingClient";

export const testKosFactory = (includeLanguageTag: LanguageTag) =>
  new Kos({
    includeLanguageTags: new LanguageTagSet(includeLanguageTag, ""),
    sparqlClient: new SparqlClient({
      endpointUrl: "http://localhost:7878/sparql",
    }),
  });
