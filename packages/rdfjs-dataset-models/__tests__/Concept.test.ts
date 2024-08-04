import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConcept10 } from "../../../__tests__/behavesLikeUnescoThesaurusConcept10.js";
import { behavesLikeUnescoThesaurusConcept10018 } from "../../../__tests__/behavesLikeUnescoThesaurusConcept10018.js";
import { testKosFactory } from "./testKosFactory.js";

describe("mem.Concept", () => {
  behavesLikeUnescoThesaurusConcept10(testKosFactory);
  behavesLikeUnescoThesaurusConcept10018(testKosFactory);
});
