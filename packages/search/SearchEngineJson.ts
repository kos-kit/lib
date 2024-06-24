import { SearchEngineType } from "./SearchEngineType.js";

/**
 * JSON serialization of a SearchEngine.
 */
export interface SearchEngineJson {
  [index: string]: any;
  type: SearchEngineType;
}
