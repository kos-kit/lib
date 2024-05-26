import { SearchEngineJson } from "./SearchEngineJson";
import { SearchResult } from "./SearchResult";

export interface SearchEngine {
  search(kwds: {
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]>;

  searchCount(kwds: { query: string }): Promise<number>;

  toJson(): SearchEngineJson;
}
