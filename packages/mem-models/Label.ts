import { Label as ILabel } from "@kos-kit/models";
import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Model } from "./Model.js";

export class Label extends Model<BlankNode | NamedNode> implements ILabel {
  readonly literalForm: Literal;

  constructor({ literalForm, ...modelParameters }: Label.Parameters) {
    super(modelParameters);
    this.literalForm = literalForm;
  }
}

export namespace Label {
  export interface Parameters extends Model.Parameters<BlankNode | NamedNode> {
    literalForm: Literal;
  }
}
