import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LabeledModel as ILabeledModel,
  LiteralLabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { NamedNode } from "@rdfjs/types";
import { skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { Model } from "./Model.js";
import { ModelFactory } from "./ModelFactory.js";
import { matchLiteral } from "./matchLiteral.js";
import { Maybe } from "purify-ts";

export abstract class LabeledModel<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends Model<NamedNode>
  implements ILabeledModel
{
  protected readonly modelFactory: ModelFactory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;

  constructor({
    modelFactory,
    ...modelParameters
  }: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(modelParameters);
    this.modelFactory = modelFactory;
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

    return Resource.Identifier.toString(this.identifier);
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
      ...[...this.resource.values(skosPredicate)].flatMap((value) =>
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
      ...[...this.resource.values(skosXlPredicate)].flatMap((labelValue) =>
        labelValue
          .toResource()
          .chain((labelResource) =>
            Maybe.fromNullable(
              [...labelResource.values(skosxl.literalForm)]
                .flatMap((value) =>
                  value
                    .toLiteral()
                    .filter((literal) =>
                      matchLiteral(literal, {
                        includeLanguageTags: this.includeLanguageTags,
                      }),
                    )
                    .toList(),
                )
                .at(0),
            ).map((literalForm) =>
              this.modelFactory.createLabel({
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

export namespace LabeledModel {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends Model.Parameters<NamedNode> {
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
  }
}
