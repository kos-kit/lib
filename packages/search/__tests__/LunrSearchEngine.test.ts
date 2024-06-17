import { describe } from "vitest";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { LunrSearchEngine } from "../src";
import { testKosFactory } from "../../mem-models/__tests__/testKosFactory";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      kos: testKosFactory("en"),
    }),
  );
});
