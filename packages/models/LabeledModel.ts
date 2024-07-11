import { Label } from "./Label.js";
import { Model } from "./Model.js";
import { NamedNode } from "@rdfjs/types";

/**
 * Common interface between Concept and ConceptScheme.
 */
export interface LabeledModel extends Model {
  /**
   * Alternate labels, equivalent to skos:altLabel.
   */
  readonly altLabels: readonly Label[];
  readonly displayLabel: string;
  /**
   * Hidden labels, equivalent to skos:hiddenLabel.
   */
  readonly hiddenLabels: readonly Label[];
  readonly identifier: NamedNode;
  /**
   * Preferred labels, equivalent to skos:prefLabel.
   */
  readonly prefLabels: readonly Label[];
}
