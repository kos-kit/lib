import { ServerSearchEngine } from "..";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine.js";
import { describe } from "vitest";

(process.env["CI"] ? describe.skip : describe)("ServerSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    Promise.resolve(new ServerSearchEngine("http://localhost:7878/search")),
  );
});
