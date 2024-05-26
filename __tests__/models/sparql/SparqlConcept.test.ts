import { testSparqlKos } from "./testSparqlKos";
import { behavesLikeUnescoThesaurusConcept10018 } from "../behavesLikeUnescoThesaurusConcept10018";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConcept10 } from "../behavesLikeUnescoThesaurusConcept10";

describe("SparqlConcept", () => {
  behavesLikeUnescoThesaurusConcept10(() =>
    testSparqlKos.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10",
      ),
    ),
  );

  behavesLikeUnescoThesaurusConcept10018(() =>
    testSparqlKos.conceptByIdentifier(
      DataFactory.namedNode(
        "http://vocabularies.unesco.org/thesaurus/concept10018",
      ),
    ),
  );
});
