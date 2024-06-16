import { behavesLikeKos } from "../../models/__tests__/behavesLikeKos";
import { testKosFactory } from "./testKosFactory";

describe("mem.Kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
