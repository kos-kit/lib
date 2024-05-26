import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { testRdfJsKos } from "../models/rdfjs/testRdfJsKos";
import { LunrSearchEngine } from "../../src/search/LunrSearchEngine";

describe("LunrSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    LunrSearchEngine.create({
      conceptsLimit: 10,
      languageTag: "en",
      kos: testRdfJsKos,
    }),
  );
});
