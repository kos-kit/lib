import { describe } from "vitest";
import { behavesLikeKos } from "../../../__tests__/behavesLikeKos.js";
import { testKosFactory } from "./testKosFactory.js";

(process.env["CI"] ? describe.skip : describe)("sparql.kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
