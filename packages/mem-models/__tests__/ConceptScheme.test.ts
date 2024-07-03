import { DataFactory } from "n3";
import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConceptScheme } from "../../models/__tests__/behavesLikeUnescoThesaurusConceptScheme.js";
import { orFail } from "../../models/__tests__/orFail.js";
import { testKosFactory } from "./testKosFactory.js";

describe("mem.ConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptSchemeByIdentifier(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      )
      .then(orFail),
  );
});
