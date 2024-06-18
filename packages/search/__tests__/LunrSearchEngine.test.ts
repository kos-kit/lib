import { describe } from "vitest";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine.js";
import { LunrSearchEngine } from "..";
import { testKosFactory } from "../../mem-models/__tests__/testKosFactory.js";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      kos: testKosFactory("en"),
    }),
  );
});
