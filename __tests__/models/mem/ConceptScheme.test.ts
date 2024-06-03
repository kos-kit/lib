import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";
import { testKosFactory } from "./testKosFactory";

describe("mem.ConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme((includeLanguageTag) =>
    testKosFactory(includeLanguageTag).conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
