import { behavesLikeKos } from "../behavesLikeKos";
import { testKos } from "./testKos";

describe("mem.Kos", () => {
  behavesLikeKos(testKos);
});
