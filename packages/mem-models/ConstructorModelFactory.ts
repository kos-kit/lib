import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore, Literal } from "@rdfjs/types";
import { Label } from "./Label";
import { LabeledModel } from "./LabeledModel.js";
import { ModelFactory } from "./ModelFactory.js";

export class ConstructorModelFactory<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> implements ModelFactory<ConceptT, ConceptSchemeT, LabelT>
{
  private readonly conceptConstructor: new (
    parameters: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptT;
  private readonly conceptSchemeConstructor: new (
    parameters: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptSchemeT;
  private readonly dataset: DatasetCore;
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly labelConstructor: new (
    parameters: Label.Parameters,
  ) => LabelT;

  constructor({
    conceptConstructor,
    conceptSchemeConstructor,
    dataset,
    includeLanguageTags,
    labelConstructor,
  }: {
    conceptConstructor: new (
      parameters: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptT;
    conceptSchemeConstructor: new (
      parameters: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptSchemeT;
    dataset: DatasetCore;
    includeLanguageTags: LanguageTagSet;
    labelConstructor: new (parameters: Label.Parameters) => LabelT;
  }) {
    this.conceptConstructor = conceptConstructor;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.dataset = dataset;
    this.includeLanguageTags = includeLanguageTags;
    this.labelConstructor = labelConstructor;
  }

  createConcept(identifier: Resource.Identifier): ConceptT {
    return new this.conceptConstructor({
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: this,
    });
  }

  createConceptScheme(identifier: Resource.Identifier): ConceptSchemeT {
    return new this.conceptSchemeConstructor({
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: this,
    });
  }

  createLabel({
    identifier,
    literalForm,
  }: {
    identifier: Resource.Identifier;
    literalForm: Literal;
  }): LabelT {
    return new this.labelConstructor({
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      literalForm,
    });
  }
}
