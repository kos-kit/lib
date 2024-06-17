import { describe } from "vitest";
import { behavesLikeKos } from "../../models/__tests__/behavesLikeKos";
import { testKosFactory } from "./testKosFactory";

(process.env["CI"] ? describe.skip : describe)("sparql.kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
