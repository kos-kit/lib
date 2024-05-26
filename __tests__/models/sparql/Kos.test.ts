import { behavesLikeKos } from "../behavesLikeKos";
import { testKos as testKos } from "./testKos";

describe("sparql.kos", () => {
  behavesLikeKos(testKos);
});
