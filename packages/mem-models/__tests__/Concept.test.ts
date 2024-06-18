import { testKosFactory } from "./testKosFactory.js";
import { behavesLikeUnescoThesaurusConcept10018 } from "../../models/__tests__/behavesLikeUnescoThesaurusConcept10018.js";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConcept10 } from "../../models/__tests__/behavesLikeUnescoThesaurusConcept10.js";
import { describe } from "vitest";

describe("mem.Concept", () => {
  behavesLikeUnescoThesaurusConcept10((includeLanguageTag) =>
    testKosFactory(includeLanguageTag).conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10",
      ),
    ),
  );

  behavesLikeUnescoThesaurusConcept10018((includeLanguageTag) =>
    testKosFactory(includeLanguageTag).conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10018",
      ),
    ),
  );
});
