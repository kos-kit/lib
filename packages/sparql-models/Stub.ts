import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  LabeledModel as ILabeledModel,
  Stub as IStub,
} from "@kos-kit/models";
import { ModelFetcher } from "./ModelFetcher.js";
import { Maybe } from "purify-ts";

export abstract class Stub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  LabeledModelT extends ILabeledModel,
> implements IStub<LabeledModelT>
{
  readonly identifier: ILabeledModel.Identifier;
  protected readonly modelFetcher: ModelFetcher<
    SparqlConceptT,
    SparqlConceptSchemeT
  >;

  constructor({
    identifier,
    modelFetcher,
  }: {
    identifier: ILabeledModel.Identifier;
    modelFetcher: ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>;
  }) {
    this.identifier = identifier;
    this.modelFetcher = modelFetcher;
  }

  get displayLabel() {
    return ILabeledModel.Identifier.toString(this.identifier);
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
