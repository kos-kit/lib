import { LunrSearchEngine } from "./LunrSearchEngine";
import { SearchEngineType } from "./SearchEngineType";

export const createSearchEngineFromJson = (json: {
  [index: string]: any;
  type: SearchEngineType;
}) => {
  switch (json.type) {
    case "Lunr":
      return LunrSearchEngine.fromJson(json);
    default:
      throw new RangeError(json.type);
  }
};
