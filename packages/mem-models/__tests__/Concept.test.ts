import { DataFactory } from "n3";
import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConcept10 } from "../../models/__tests__/behavesLikeUnescoThesaurusConcept10.js";
import { behavesLikeUnescoThesaurusConcept10018 } from "../../models/__tests__/behavesLikeUnescoThesaurusConcept10018.js";
import { orFail } from "../../models/__tests__/orFail.js";
import { testKosFactory } from "./testKosFactory.js";

describe("mem.Concept", () => {
  behavesLikeUnescoThesaurusConcept10((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptByIdentifier(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10",
        ),
      )
      .then(orFail),
  );

  behavesLikeUnescoThesaurusConcept10018((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptByIdentifier(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10018",
        ),
      )
      .then(orFail),
  );
});
