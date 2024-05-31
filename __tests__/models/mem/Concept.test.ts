import { testKos } from "./testKos";
import { behavesLikeUnescoThesaurusConcept10018 } from "../behavesLikeUnescoThesaurusConcept10018";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConcept10 } from "../behavesLikeUnescoThesaurusConcept10";

describe("mem.Concept", () => {
  behavesLikeUnescoThesaurusConcept10(() =>
    testKos.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10",
      ),
    ),
  );

  behavesLikeUnescoThesaurusConcept10018(() =>
    testKos.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10018",
      ),
    ),
  );
});
