import { SearchEngineType } from "./SearchEngineType.js";

/**
 * JSON serialization of a SearchEngine.
 */
export type SearchEngineJson = { [index: string]: any; type: SearchEngineType };
