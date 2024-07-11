import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal, NamedNode } from "@rdfjs/types";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { ModelFactory } from "./ModelFactory.js";

export class DefaultModelFactory<
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
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly labelConstructor: new (
    parameters: Label.Parameters,
  ) => LabelT;

  constructor({
    conceptConstructor,
    conceptSchemeConstructor,
    includeLanguageTags,
    labelConstructor,
  }: {
    conceptConstructor: new (
      parameters: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptT;
    conceptSchemeConstructor: new (
      parameters: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptSchemeT;
    includeLanguageTags: LanguageTagSet;
    labelConstructor: new (parameters: Label.Parameters) => LabelT;
  }) {
    this.conceptConstructor = conceptConstructor;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.includeLanguageTags = includeLanguageTags;
    this.labelConstructor = labelConstructor;
  }

  createConcept(resource: Resource<NamedNode>): ConceptT {
    return new this.conceptConstructor({
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: this,
      resource,
    });
  }

  createConceptScheme(resource: Resource<NamedNode>): ConceptSchemeT {
    return new this.conceptSchemeConstructor({
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: this,
      resource,
    });
  }

  createLabel({
    literalForm,
    resource,
  }: {
    literalForm: Literal;
    resource: Resource;
  }): LabelT {
    return new this.labelConstructor({
      includeLanguageTags: this.includeLanguageTags,
      literalForm,
      resource,
    });
  }
}
