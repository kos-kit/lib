import { describe } from "vitest";
import { behavesLikeUnescoThesaurusKos } from "../../../__tests__/behavesLikeUnescoThesaurusKos.js";
import { testKosFactory } from "./testKosFactory.js";

(process.env["CI"] ? describe.skip : describe)("sparql.kos", () => {
  behavesLikeUnescoThesaurusKos(testKosFactory);
});
