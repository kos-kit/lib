import { Label } from "./Label.js";
import { NamedModel } from "./NamedModel.js";

export interface LabeledModel extends NamedModel {
  labels(type?: Label.Type): readonly Label[];
}
