import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Identifier,
  Label as ILabel,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal } from "@rdfjs/types";
import { Label } from "./Label.js";
import { ModelFactory } from "./ModelFactory.js";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";

export class DefaultModelFactory<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> implements ModelFactory<ConceptT, ConceptSchemeT, LabelT>
{
  private readonly conceptConstructor: new (
    parameters: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptT;
  private readonly conceptSchemeConstructor: new (
    parameters: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>,
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
      parameters: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptT;
    conceptSchemeConstructor: new (
      parameters: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptSchemeT;
    includeLanguageTags: LanguageTagSet;
    labelConstructor: new (parameters: Label.Parameters) => LabelT;
  }) {
    this.conceptConstructor = conceptConstructor;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.includeLanguageTags = includeLanguageTags;
    this.labelConstructor = labelConstructor;
  }

  createConcept(resource: Resource<Identifier>): ConceptT {
    return new this.conceptConstructor({
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: this,
      resource,
    });
  }

  createConceptScheme(resource: Resource<Identifier>): ConceptSchemeT {
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
    resource: Resource<Identifier>;
  }): LabelT {
    return new this.labelConstructor({
      includeLanguageTags: this.includeLanguageTags,
      literalForm,
      resource,
    });
  }
}
