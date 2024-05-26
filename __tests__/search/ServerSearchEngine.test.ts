import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { ServerSearchEngine } from "../../src/search/ServerSearchEngine";

describe("ServerSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    Promise.resolve(new ServerSearchEngine("http://localhost:7878/search")),
  );
});
