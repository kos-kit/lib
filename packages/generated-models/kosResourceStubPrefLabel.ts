import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { KosResourceStub, LanguageTag } from "./index.js";

export function kosResourceStubPrefLabel(
  resourceStub: KosResourceStub,
  options?: { languageIn?: readonly LanguageTag[] },
): Maybe<Literal> {
  const languageIn = new Set(options?.languageIn ?? []);

  for (const literalForm of resourceStub.prefLabel) {
    if (languageIn.size === 0 || languageIn.has(literalForm.language)) {
      return Maybe.of(literalForm);
    }
  }

  for (const prefLabelXl of resourceStub.prefLabelXl) {
    for (const literalForm of prefLabelXl.literalForm) {
      if (languageIn.size === 0 || languageIn.has(literalForm.language)) {
        return Maybe.of(literalForm);
      }
    }
  }

  return Maybe.empty();
}
