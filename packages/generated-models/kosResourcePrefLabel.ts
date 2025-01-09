import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { KosResource, Label, LanguageTag } from "./index.js";

export function kosResourcePrefLabel(
  kosResource: KosResource,
  options?: { languageIn?: readonly LanguageTag[] },
): Maybe<{ label: Label | null; literalForm: Literal }> {
  const languageIn = new Set(options?.languageIn ?? []);

  for (const literalForm of kosResource.prefLabel) {
    if (languageIn.size === 0 || languageIn.has(literalForm.language)) {
      return Maybe.of({ label: null, literalForm });
    }
  }

  for (const prefLabelXl of kosResource.prefLabelXl) {
    for (const literalForm of prefLabelXl.literalForm) {
      if (languageIn.size === 0 || languageIn.has(literalForm.language)) {
        return Maybe.of({ label: prefLabelXl, literalForm });
      }
    }
  }

  return Maybe.empty();
}
