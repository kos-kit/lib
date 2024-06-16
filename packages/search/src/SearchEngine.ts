import { LanguageTag } from "../models";
import { SearchEngineJson } from "./SearchEngineJson";
import { SearchResults } from "./SearchResults";

export interface SearchEngine {
  search(kwds: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<SearchResults>;

  toJson(): SearchEngineJson;
}
