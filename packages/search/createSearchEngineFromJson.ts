import { LunrSearchEngine } from "./src/LunrSearchEngine";
import { SearchEngineType } from "./src/SearchEngineType";
import { ServerSearchEngine } from "./src/ServerSearchEngine";

export const createSearchEngineFromJson = (json: {
  [index: string]: any;
  type: SearchEngineType;
}) => {
  switch (json.type) {
    case "Lunr":
      return LunrSearchEngine.fromJson(json);
    case "Server":
      return ServerSearchEngine.fromJson(json);
    default:
      throw new RangeError(json.type);
  }
};
