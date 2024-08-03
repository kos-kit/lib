import { describe } from "vitest";
import { LunrSearchEngine } from "..";
import { testKosFactory } from "../../rdfjs-dataset-models/__tests__/testKosFactory.js";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine.js";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      kos: testKosFactory("en"),
    }),
  );
});
