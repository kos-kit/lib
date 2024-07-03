import { LanguageTag } from "./LanguageTag.js";

/**
 * Ordered set of language tags.
 */
export class LanguageTagSet {
  private readonly languageTags: readonly LanguageTag[];

  constructor(...languageTags: readonly LanguageTag[]) {
    this.languageTags = languageTags;
  }

  get size(): number {
    return this.languageTags.length;
  }

  [Symbol.iterator]() {
    return this.languageTags[Symbol.iterator]();
  }

  has(languageTag: LanguageTag): boolean {
    for (const languageTag_ of this.languageTags) {
      if (languageTag_ === languageTag) {
        return true;
      }
    }
    return false;
  }
}
