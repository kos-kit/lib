import { DataFactory } from "n3";
import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConceptScheme } from "../../../__tests__/behavesLikeUnescoThesaurusConceptScheme.js";
import { testKosFactory } from "./testKosFactory.js";

(process.env["CI"] ? describe.skip : describe)("sparql.ConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptSchemeByIdentifier(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      )
      .resolve()
      .then((conceptScheme) =>
        conceptScheme.orDefaultLazy(() => {
          throw new Error("missing concept scheme");
        }),
      ),
  );
});
