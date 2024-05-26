import { testRdfJsKos } from "./testRdfJsKos";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";

describe("RdfJsConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme(() =>
    testRdfJsKos.conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
