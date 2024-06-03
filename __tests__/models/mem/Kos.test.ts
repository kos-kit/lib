import { behavesLikeKos } from "../behavesLikeKos";
import { testKosFactory } from "./testKosFactory";

describe("mem.Kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
