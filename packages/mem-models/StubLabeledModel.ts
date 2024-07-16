import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  LabeledModel as ILabeledModel,
  StubLabeledModel as IStubLabeledModel,
} from "@kos-kit/models";
import { StubModel } from "./StubModel.js";
import { ModelFactory } from "./ModelFactory.js";

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
  }: {
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
  } & StubModel.Parameters<ILabeledModel.Identifier>) {
    super(modelParameters);
    this.modelFactory = modelFactory;
  }
}
