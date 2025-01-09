import { Literal } from "@rdfjs/types";
import { Label, LanguageTag, Resource, resourcePrefLabel } from "./index.js";

export function resourceLabels(
  resource: Resource,
  options?: { languageIn?: readonly LanguageTag[] },
): {
  alternative: readonly { label: Label | null; literalForm: Literal }[];
  hidden: readonly { label: Label | null; literalForm: Literal }[];
  preferred: readonly { label: Label | null; literalForm: Literal }[];
} {
  const languageIn = new Set(options?.languageIn ?? []);

  const alternativeOrHiddenLabels = (
    skosLabels: readonly Literal[],
    skosXlLabels: readonly Label[],
  ): readonly { label: Label | null; literalForm: Literal }[] => {
    const result: { label: Label | null; literalForm: Literal }[] = [];

    for (const skosLabel of skosLabels) {
      if (languageIn.size === 0 || languageIn.has(skosLabel.language)) {
        result.push({ label: null, literalForm: skosLabel });
      }
    }

    for (const skosXlLabel of skosXlLabels) {
      for (const literalForm of skosXlLabel.literalForm) {
        if (languageIn.size === 0 || languageIn.has(literalForm.language)) {
          result.push({ label: skosXlLabel, literalForm });
        }
      }
    }

    return result;
  };

  return {
    alternative: alternativeOrHiddenLabels(
      resource.altLabel,
      resource.altLabelXl,
    ),
    hidden: alternativeOrHiddenLabels(
      resource.hiddenLabel,
      resource.hiddenLabelXl,
    ),
    preferred: resourcePrefLabel(resource, options).toList(),
  };
}
