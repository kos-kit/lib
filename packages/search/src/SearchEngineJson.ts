import { SearchEngineType } from "./SearchEngineType";

/**
 * JSON serialization of a SearchEngine.
 */
export type SearchEngineJson = { [index: string]: any; type: SearchEngineType };
