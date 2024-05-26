import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine";
import { ServerSearchEngine } from "../../src/search/ServerSearchEngine";

describe.skip("ServerSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    Promise.resolve(new ServerSearchEngine("http://localhost:7878/search")),
  );
});
