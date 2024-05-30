import { NamedNode } from "@rdfjs/types";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { Model } from "./Model";
import { LabeledModel as ILabeledModel } from "../LabeledModel";
import { LanguageTag } from "../LanguageTag";
import { skos, skosxl } from "../../vocabularies";
import { LiteralLabel } from "../LiteralLabel";
import { Label } from "./Label";
import { Label as ILabel } from "../Label";

export abstract class LabeledModel extends Model implements ILabeledModel {
  altLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly ILabel[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTags: kwds?.languageTags,
          skosPredicate: skos.altLabel,
          skosXlPredicate: skosxl.altLabel,
        }),
      ]),
    );
  }

  hiddenLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly ILabel[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTags: kwds?.languageTags,
          skosPredicate: skos.hiddenLabel,
          skosXlPredicate: skosxl.hiddenLabel,
        }),
      ]),
    );
  }

  private *labels({
    languageTags,
    skosPredicate,
    skosXlPredicate,
  }: {
    languageTags?: Set<LanguageTag>;
    skosPredicate: NamedNode;
    skosXlPredicate: NamedNode;
  }): Iterable<ILabel> {
    languageTags = languageTags ?? new Set();

    yield* this.filterAndMapObjects(skosPredicate, (term) =>
      term.termType === "Literal" &&
      (languageTags.size === 0 || languageTags.has(term.language))
        ? new LiteralLabel(term)
        : null,
    );

    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    yield* this.filterAndMapObjects(skosXlPredicate, (term) => {
      const labelIdentifier = mapTermToIdentifier(term);
      if (labelIdentifier === null) {
        return null;
      }

      for (const literalFormQuad of this.dataset.match(
        term,
        skosxl.literalForm,
        null,
        null,
      )) {
        if (literalFormQuad.object.termType !== "Literal") {
          continue;
        }

        if (
          languageTags.size > 0 &&
          !languageTags.has(literalFormQuad.object.language)
        ) {
          continue;
        }

        return new Label({
          dataset: this.dataset,
          identifier: labelIdentifier,
          literalForm: literalFormQuad.object,
        });
      }

      return null;
    });
  }

  prefLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly ILabel[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTags: kwds?.languageTags,
          skosPredicate: skos.prefLabel,
          skosXlPredicate: skosxl.prefLabel,
        }),
      ]),
    );
  }
}
