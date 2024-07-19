import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LabeledModel as ILabeledModel,
  Stub as IStub,
} from "@kos-kit/models";
import { ModelFactory } from "./ModelFactory.js";
import { Maybe } from "purify-ts";
import { Resource } from "@kos-kit/rdf-resource";

export abstract class Stub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
  LabeledModelT extends ILabeledModel,
> implements IStub<LabeledModelT>
{
  protected readonly modelFactory: ModelFactory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;
  protected readonly resource: Resource<ILabeledModel.Identifier>;

  constructor({
    modelFactory,
    resource,
  }: {
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
    resource: Resource<ILabeledModel.Identifier>;
  }) {
    this.modelFactory = modelFactory;
    this.resource = resource;
  }

  get displayLabel() {
    return ILabeledModel.Identifier.toString(this.identifier);
  }

  get identifier() {
    return this.resource.identifier;
  }

  abstract resolve(): Promise<Maybe<LabeledModelT>>;

  async resolveOrStub() {
    const model = (await this.resolve()).extractNullable();
    if (model !== null) {
      return model;
    } else {
      return this;
    }
  }
}
