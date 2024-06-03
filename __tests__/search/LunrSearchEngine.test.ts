import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { testKosFactory } from "../models/mem/testKosFactory";
import { LunrSearchEngine } from "../../src/search/LunrSearchEngine";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      kos: testKosFactory("en"),
    }),
  );
});
