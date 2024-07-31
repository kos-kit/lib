import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  NamedModel as INamedModel,
  Stub as IStub,
  Identifier,
} from "@kos-kit/models";
import { Maybe } from "purify-ts";
import { ModelFetcher } from "./ModelFetcher.js";

export abstract class Stub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  ModelT extends INamedModel,
> implements IStub<ModelT>
{
  readonly identifier: Identifier;
  protected readonly modelFetcher: ModelFetcher<
    SparqlConceptT,
    SparqlConceptSchemeT
  >;

  constructor({
    identifier,
    modelFetcher,
  }: {
    identifier: Identifier;
    modelFetcher: ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>;
  }) {
    this.identifier = identifier;
    this.modelFetcher = modelFetcher;
  }

  get displayLabel() {
    return Identifier.toString(this.identifier);
  }

  equals(other: IStub<ModelT>): boolean {
    return IStub.equals(this, other);
  }

  abstract resolve(): Promise<Maybe<ModelT>>;

  async resolveOrStub() {
    const model = (await this.resolve()).extractNullable();
    if (model !== null) {
      return model;
    } else {
      return this;
    }
  }
}
