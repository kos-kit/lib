import { describe } from "vitest";
import { behavesLikeUnescoThesaurusConceptScheme } from "../../../__tests__/behavesLikeUnescoThesaurusConceptScheme.js";
import { testKosFactory } from "./testKosFactory.js";

describe("sparql.ConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme(testKosFactory);
});
