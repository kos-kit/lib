import { LabeledModel } from "./LabeledModel.js";
import { StubModel } from "./StubModel.js";

export interface StubLabeledModel<LabeledModelT extends LabeledModel>
  extends StubModel<LabeledModelT> {
  readonly identifier: LabeledModel.Identifier;
}
