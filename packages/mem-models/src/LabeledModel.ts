import { NamedNode } from "@rdfjs/types";
import { Model } from "./Model";
import { Label } from "./Label";
import {
  Label as ILabel,
  LabeledModel as ILabeledModel,
  LanguageTag,
  LiteralLabel,
} from "@kos-kit/models";
import { skos, skosxl } from "@kos-kit/vocabularies";
import { Resource } from "@kos-kit/rdf-resource";
import { matchLiteral } from "./matchLiteral";

export abstract class LabeledModel extends Model implements ILabeledModel {
  get altLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.altLabel,
      skosXlPredicate: skosxl.altLabel,
    });
  }

  get displayLabel(): string {
    const prefLabels = this.prefLabels;
    if (prefLabels.length > 0) {
      for (const languageTag of this.includeLanguageTags) {
        for (const prefLabel of prefLabels) {
          if (prefLabel.literalForm.language === languageTag) {
            return prefLabel.literalForm.value;
          }
        }
      }
    }

    return Resource.Identifier.toString(this.identifier);
  }

  get hiddenLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.hiddenLabel,
      skosXlPredicate: skosxl.hiddenLabel,
    });
  }

  private labels({
    skosPredicate,
    skosXlPredicate,
  }: {
    includeLanguageTags?: Set<LanguageTag>;
    skosPredicate: NamedNode;
    skosXlPredicate: NamedNode;
  }): readonly ILabel[] {
    const labels: ILabel[] = [];

    for (const literal of this.resource.values(
      skosPredicate,
      Resource.ValueMappers.literal,
    )) {
      if (
        matchLiteral(literal, {
          includeLanguageTags: this.includeLanguageTags,
        })
      ) {
        labels.push(new LiteralLabel(literal));
      }
    }

    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    for (const labelResource of this.resource.values(
      skosXlPredicate,
      Resource.ValueMappers.resource,
    )) {
      for (const literalForm of labelResource.values(
        skosxl.literalForm,
        Resource.ValueMappers.literal,
      )) {
        if (
          !matchLiteral(literalForm, {
            includeLanguageTags: this.includeLanguageTags,
          })
        ) {
          continue;
        }

        labels.push(
          new Label({
            kos: this.kos,
            literalForm,
            resource: labelResource,
          }),
        );
      }
    }

    return labels;
  }

  get prefLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.prefLabel,
      skosXlPredicate: skosxl.prefLabel,
    });
  }
}
