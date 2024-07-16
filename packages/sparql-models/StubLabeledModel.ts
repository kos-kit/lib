import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  LabeledModel as ILabeledModel,
  StubLabeledModel as IStubLabeledModel,
} from "@kos-kit/models";
import { ModelFetcher } from "./ModelFetcher.js";
import { Maybe } from "purify-ts";

export abstract class StubLabeledModel<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  LabeledModelT extends ILabeledModel,
> implements IStubLabeledModel<LabeledModelT>
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

  abstract resolve(): Promise<Maybe<LabeledModelT>>;
}
