import {
  Identifier,
  Label as ILabel,
  LabelsMixin as ILabelsMixin,
  LanguageTagSet,
  LiteralLabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { NamedNode } from "@rdfjs/types";
import { skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { matchLiteral } from "./matchLiteral.js";
import { Maybe } from "purify-ts";
import "iterator-helpers-polyfill";
import { LabelFactory } from "./LabelFactory.js";
import { NamedModel } from "./NamedModel.js";

export class Labels<LabelT extends ILabel> implements ILabelsMixin {
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly labelFactory: LabelFactory<LabelT>;
  private readonly resource: Resource<Identifier>;

  constructor({
    includeLanguageTags,
    labelFactory,
    resource,
  }: { labelFactory: LabelFactory<LabelT> } & NamedModel.Parameters) {
    this.includeLanguageTags = includeLanguageTags;
    this.labelFactory = labelFactory;
    this.resource = resource;
  }

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

    return Resource.Identifier.toString(this.resource.identifier);
  }

  get hiddenLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.hiddenLabel,
      skosXlPredicate: skosxl.hiddenLabel,
    });
  }

  get prefLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.prefLabel,
      skosXlPredicate: skosxl.prefLabel,
    });
  }

  private labels({
    skosPredicate,
    skosXlPredicate,
  }: {
    skosPredicate: NamedNode;
    skosXlPredicate: NamedNode;
  }): readonly ILabel[] {
    return [
      // All literals that are the objects of the skosPredicate
      ...this.resource.values(skosPredicate).flatMap((value) =>
        value
          .toLiteral()
          .filter((literal) =>
            matchLiteral(literal, {
              includeLanguageTags: this.includeLanguageTags,
            }),
          )
          .map((literal) => new LiteralLabel(literal))
          .toList(),
      ),
      // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
      ...this.resource.values(skosXlPredicate).flatMap((labelValue) =>
        labelValue
          .toNamedResource()
          .chain((labelResource) =>
            Maybe.fromNullable(
              [
                ...labelResource.values(skosxl.literalForm).flatMap((value) =>
                  value
                    .toLiteral()
                    .filter((literal) =>
                      matchLiteral(literal, {
                        includeLanguageTags: this.includeLanguageTags,
                      }),
                    )
                    .toList(),
                ),
              ].at(0),
            ).map((literalForm) =>
              this.labelFactory.createLabel({
                literalForm,
                resource: labelResource,
              }),
            ),
          )
          .toList(),
      ),
    ];
  }
}
