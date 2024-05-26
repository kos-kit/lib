import { LanguageTag } from "../models";
import { SearchEngineJson } from "./SearchEngineJson";
import { SearchResult } from "./SearchResult";

export interface SearchEngine {
  search(kwds: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]>;

  searchCount(kwds: {
    languageTag: LanguageTag;
    query: string;
  }): Promise<number>;

  toJson(): SearchEngineJson;
}
