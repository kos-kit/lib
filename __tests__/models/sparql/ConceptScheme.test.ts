import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";
import { testKosFactory } from "./testKosFactory";

(process.env["CI"] ? describe.skip : describe)("SparqlConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme((includeLanguageTag) =>
    testKosFactory(includeLanguageTag).conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
