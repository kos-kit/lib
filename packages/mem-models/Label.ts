import { Label as ILabel } from "@kos-kit/models";
import { Literal } from "@rdfjs/types";
import { Mixin } from "ts-mixer";
import { ProvenanceMixin } from "./ProvenanceMixin.js";
import { NamedModel } from "./NamedModel.js";

export class Label
  extends Mixin(NamedModel, ProvenanceMixin)
  implements ILabel
{
  override readonly displayLabel: string;
  readonly literalForm: Literal;

  constructor({ literalForm, ...namedModelParameters }: Label.Parameters) {
    super(namedModelParameters);
    this.displayLabel = literalForm.value;
    this.literalForm = literalForm;
  }

  equals(other: ILabel): boolean {
    return ILabel.equals(this, other);
  }
}

export namespace Label {
  export interface Parameters extends NamedModel.Parameters {
    literalForm: Literal;
  }
}
