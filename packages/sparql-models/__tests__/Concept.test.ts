import { DataFactory } from "n3";
import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConcept10 } from "../../models/__tests__/behavesLikeUnescoThesaurusConcept10.js";
import { behavesLikeUnescoThesaurusConcept10018 } from "../../models/__tests__/behavesLikeUnescoThesaurusConcept10018.js";
import { testKosFactory } from "./testKosFactory.js";

(process.env["CI"] ? describe.skip : describe)("sparql.Concept", () => {
  behavesLikeUnescoThesaurusConcept10((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptByIdentifier(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10",
        ),
      )
      .resolve()
      .then((concept) =>
        concept.orDefaultLazy(() => {
          throw new Error("missing concept");
        }),
      ),
  );

  behavesLikeUnescoThesaurusConcept10018((includeLanguageTag) =>
    testKosFactory(includeLanguageTag)
      .conceptByIdentifier(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10018",
        ),
      )
      .resolve()
      .then((concept) =>
        concept.orDefaultLazy(() => {
          throw new Error("missing concept");
        }),
      ),
  );
});
