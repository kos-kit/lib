import { Label } from "./Label";
import { LanguageTag } from "./LanguageTag";
import { Model } from "./Model";

/**
 * Common interface between Concept and ConceptScheme.
 */
export interface LabeledModel extends Model {
  /**
   * Alternate labels, equivalent to skos:altLabel.
   *
   * See note on prefLabels re: languageTags.
   */
  altLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly Label[]>;

  /**
   * Hidden labels, equivalent to skos:hiddenLabel.
   *
   * See note on prefLabels re: languageTags.
   */
  hiddenLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly Label[]>;

  /**
   * Preferred labels, equivalent to skos:prefLabel.
   *
   * If languageTags is specified, return all preferred labels that have one of the language tags. A language tag can be empty.
   * If languageTags is not specified, return all preferred labels.
   */
  prefLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly Label[]>;
}
