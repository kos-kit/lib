import { behavesLikeKos } from "../behavesLikeKos";
import { testKos as testKos } from "./testKos";

(process.env["CI"] ? describe.skip : describe)("sparql.kos", () => {
  behavesLikeKos(testKos);
});
