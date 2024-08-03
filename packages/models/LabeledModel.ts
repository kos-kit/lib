import { Label } from "./Label.js";
import { LiteralLabel } from "./LiteralLabel.js";
import { NamedModel } from "./NamedModel.js";

export interface LabeledModel<LabelT extends Label> extends NamedModel {
  labels(type?: Label.Type): readonly (LiteralLabel | LabelT)[];
}
