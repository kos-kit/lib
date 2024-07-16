import { DataFactory } from "n3";
import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConceptScheme } from "../../models/__tests__/behavesLikeUnescoThesaurusConceptScheme.js";
import { testKosFactory } from "./testKosFactory.js";

describe("mem.ConceptScheme", () => {
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
