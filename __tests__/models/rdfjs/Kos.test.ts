import { behavesLikeKos } from "../behavesLikeKos";
import { testKos } from "./testKos";

describe("rdfjs.Kos", () => {
  behavesLikeKos(testKos);
});
