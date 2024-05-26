import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { testKos } from "../models/rdfjs/testKos";
import { LunrSearchEngine } from "../../src/search/LunrSearchEngine";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      kos: testKos,
    }),
  );
});
