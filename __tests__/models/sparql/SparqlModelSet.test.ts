import { behavesLikeKos } from "../behavesLikeKos";
import { testSparqlKos } from "./testSparqlKos";

describe("SparqlKos", () => {
  behavesLikeKos(testSparqlKos);
});
