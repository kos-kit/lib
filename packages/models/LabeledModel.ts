import { Label } from "./Label.js";
import { LiteralLabel } from "./LiteralLabel.js";
import { NamedModel } from "./NamedModel.js";

export interface LabeledModel<LabelT extends Label> extends NamedModel {
  labels(options?: { types?: readonly Label.Type[] }): readonly (
    | LiteralLabel
    | LabelT
  )[];
}
