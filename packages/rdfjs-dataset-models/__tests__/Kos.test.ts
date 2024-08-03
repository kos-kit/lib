import { describe } from "vitest";
import { behavesLikeKos } from "../../../__tests__/behavesLikeKos.js";
import { testKosFactory } from "./testKosFactory.js";

describe("mem.Kos", () => {
  behavesLikeKos(testKosFactory("en"));
});
