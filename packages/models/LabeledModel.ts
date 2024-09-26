import { Label } from "./Label.js";
import { LiteralLabel } from "./LiteralLabel.js";
import { Model } from "./Model.js";

export interface LabeledModel<LabelT extends Label> extends Model {
  readonly displayLabel: string;

  labels(options?: { types?: readonly Label.Type[] }): readonly (
    | LiteralLabel
    | LabelT
  )[];
}
