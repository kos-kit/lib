import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  NamedModel as INamedModel,
  Stub as IStub,
  Identifier,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Maybe } from "purify-ts";
import { ModelFactory } from "./ModelFactory.js";

export abstract class Stub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
  ModelT extends INamedModel,
> implements IStub<ModelT>
{
  protected readonly modelFactory: ModelFactory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;
  protected readonly resource: Resource<Identifier>;

  constructor({
    modelFactory,
    resource,
  }: {
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
    resource: Resource<Identifier>;
  }) {
    this.modelFactory = modelFactory;
    this.resource = resource;
  }

  get displayLabel() {
    return Identifier.toString(this.identifier);
  }

  get identifier() {
    return this.resource.identifier;
  }

  equals(other: IStub<ModelT>): boolean {
    return IStub.equals(this, other);
  }

  abstract resolve(): Promise<Maybe<ModelT>>;

  async resolveOrStub() {
    const model = (await this.resolve()).extractNullable();
    if (model !== null) {
      return model;
    }
    return this;
  }
}
