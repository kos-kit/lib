import * as mem from "@kos-kit/mem-models";
import { LanguageTag, LanguageTagSet } from "@kos-kit/models";
import { Concept, ConceptScheme, Kos, HttpSparqlClient } from "..";
import { DefaultModelFetcher } from "../DefaultModelFetcher.js";

export const testKosFactory = (includeLanguageTag: LanguageTag) => {
  const includeLanguageTags = new LanguageTagSet(includeLanguageTag, "");
  const sparqlClient = new HttpSparqlClient({
    endpointUrl: "http://localhost:7878/sparql",
    operation: "postDirect",
  });
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
