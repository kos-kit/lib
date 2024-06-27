import { Label as ILabel } from "@kos-kit/models";
import { Literal } from "@rdfjs/types";
import { Model } from "./Model.js";

export class Label extends Model implements ILabel {
  readonly literalForm: Literal;

  constructor({ literalForm, ...modelParameters }: Label.Parameters) {
    super(modelParameters);
    this.literalForm = literalForm;
  }
}

export namespace Label {
  export interface Parameters extends Model.Parameters {
    literalForm: Literal;
  }

  export type Factory<LabelT extends Label> = new (
    parameters: Parameters,
  ) => LabelT;
}
