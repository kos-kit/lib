import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  LabeledModel as ILabeledModel,
  Label,
} from "@kos-kit/models";
import { Model } from "./Model.js";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";
import { NamedNode } from "@rdfjs/types";

export abstract class LabeledModel<
    MemLabeledModelT extends ILabeledModel,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends Model<MemLabeledModelT, NamedNode>
  implements ILabeledModel
{
  protected readonly modelFetcher: ModelFetcher<
    SparqlConceptT,
    SparqlConceptSchemeT
  >;
  protected readonly sparqlClient: SparqlClient;

  constructor({
    modelFetcher,
    sparqlClient,
    ...modelParameters
  }: LabeledModel.Parameters<
    MemLabeledModelT,
    SparqlConceptT,
    SparqlConceptSchemeT
  >) {
    super(modelParameters);
    this.modelFetcher = modelFetcher;
    this.sparqlClient = sparqlClient;
  }

  get altLabels(): readonly Label[] {
    return this.memModel.altLabels;
  }

  get displayLabel(): string {
    return this.memModel.displayLabel;
  }

  get hiddenLabels(): readonly Label[] {
    return this.memModel.hiddenLabels;
  }

  get prefLabels(): readonly Label[] {
    return this.memModel.prefLabels;
  }
}

export namespace LabeledModel {
  export interface Parameters<
    MemLabeledModelT extends ILabeledModel,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  > extends Model.Parameters<MemLabeledModelT> {
    modelFetcher: ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>;
    sparqlClient: SparqlClient;
  }
}
