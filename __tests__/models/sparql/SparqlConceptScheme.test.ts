import { testSparqlKos } from "./testSparqlKos";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";

describe("SparqlConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme(() =>
    testSparqlKos.conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
