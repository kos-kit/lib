import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { testRdfJsModelSet } from "../models/rdfjs/testRdfJsModelSet";
import { LunrSearchEngine } from "../../src/search/LunrSearchEngine";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      modelSet: testRdfJsModelSet,
    }),
  );
});
