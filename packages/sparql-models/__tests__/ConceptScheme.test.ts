import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../../models/__tests__/behavesLikeUnescoThesaurusConceptScheme.js";
import { testKosFactory } from "./testKosFactory.js";
import { describe } from "vitest";
import { orFail } from "@kos-kit/models/__tests__/orFail.js";

(process.env["CI"] ? describe.skip : describe)("sparql.ConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptSchemeByIdentifier(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      )
      .then(orFail),
  );
});
