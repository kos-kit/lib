import { SearchResult } from "./SearchResult";

export interface SearchResults {
  readonly page: readonly SearchResult[];
  readonly total: number;
}
