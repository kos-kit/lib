import { behavesLikeKos } from "../../models/__tests__/behavesLikeKos.js";
import { testKosFactory } from "./testKosFactory.js";
import { describe } from "vitest";

describe("mem.Kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
