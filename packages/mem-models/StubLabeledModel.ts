import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LabeledModel as ILabeledModel,
  StubLabeledModel as IStubLabeledModel,
} from "@kos-kit/models";
import { StubModel } from "./StubModel.js";
import { ModelFactory } from "./ModelFactory.js";
import { LabeledModel } from "./LabeledModel.js";

export abstract class StubLabeledModel<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
    LabeledModelT extends ILabeledModel,
  >
  extends StubModel<ILabeledModel.Identifier, LabeledModelT>
  implements IStubLabeledModel<LabeledModelT>
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
}
