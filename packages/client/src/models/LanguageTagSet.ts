import { LanguageTag } from "./LanguageTag";

/**
 * Ordered set of language tags.
 */
export class LanguageTagSet {
  private readonly languageTags: readonly LanguageTag[];

  constructor(...languageTags: readonly LanguageTag[]) {
    this.languageTags = languageTags;
  }

  has(languageTag: LanguageTag): boolean {
    for (const languageTag_ of this.languageTags) {
      if (languageTag_ === languageTag) {
        return true;
      }
    }
    return false;
  }

  [Symbol.iterator]() {
    return this.languageTags[Symbol.iterator]();
  }

  get size(): number {
    return this.languageTags.length;
  }
}
