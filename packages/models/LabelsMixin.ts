import { Arrays } from "purify-ts-helpers";
import { Label } from "./Label.js";

export interface LabelsMixin {
  /**
   * Alternate labels, equivalent to skos:altLabel.
   */
  readonly altLabels: readonly Label[];
  readonly displayLabel: string;
  /**
   * Hidden labels, equivalent to skos:hiddenLabel.
   */
  readonly hiddenLabels: readonly Label[];
  /**
   * Preferred labels, equivalent to skos:prefLabel.
   */
  readonly prefLabels: readonly Label[];
}

export namespace LabelsMixin {
  export function equals(left: LabelsMixin, right: LabelsMixin): boolean {
    function labelsArraysEquals(
      left: readonly Label[],
      right: readonly Label[],
    ) {
      return Arrays.equals(left, right, (left, right) =>
        left.literalForm.equals(right.literalForm),
      );
    }

    if (!labelsArraysEquals(left.altLabels, right.altLabels)) {
      return false;
    }

    if (!labelsArraysEquals(left.hiddenLabels, right.hiddenLabels)) {
      return false;
    }
    if (!labelsArraysEquals(left.prefLabels, right.prefLabels)) {
      return false;
    }

    return true;
  }
}
