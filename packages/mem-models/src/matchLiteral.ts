import { Literal } from "@rdfjs/types";
import { LanguageTagSet } from "@kos-kit/rdf-resource/src/LanguageTagSet";

export function matchLiteral(
  literal: Literal,
  pattern: { includeLanguageTags: LanguageTagSet },
): boolean {
  const { includeLanguageTags } = pattern;

  if (includeLanguageTags.size === 0) {
    return true;
  }

  for (const languageTag of includeLanguageTags) {
    if (literal.language === languageTag) {
      return true;
    }
  }

  return false;
}
