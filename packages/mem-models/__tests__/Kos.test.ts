import { behavesLikeKos } from "../../models/__tests__/behavesLikeKos";
import { testKosFactory } from "./testKosFactory";
import { describe } from "vitest";

describe("mem.Kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
