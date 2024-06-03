import { behavesLikeKos } from "../behavesLikeKos";
import { testKosFactory } from "./testKosFactory";

(process.env["CI"] ? describe.skip : describe)("sparql.kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
