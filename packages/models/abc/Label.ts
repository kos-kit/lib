import { Literal } from "@rdfjs/types";
import { Label as ILabel } from "../Label.js";
import { NamedModel } from "./NamedModel.js";

export abstract class Label extends NamedModel implements ILabel {
  readonly literalForm: Literal;
  readonly type: ILabel.Type;

  constructor({ literalForm, type, ...superParameters }: Label.Parameters) {
    super(superParameters);
    this.literalForm = literalForm;
    this.type = type;
  }

  get displayLabel(): string {
    return this.literalForm.value;
  }

  equals(other: ILabel): boolean {
    return Label.equals(this, other);
  }
}

export namespace Label {
  export function equals(left: ILabel, right: ILabel): boolean {
    if (left.type.type !== right.type.type) {
      return false;
    }

    if (!left.literalForm.equals(right.literalForm)) {
      return false;
    }

    return true;
  }

  export interface Parameters extends NamedModel.Parameters {
    literalForm: Literal;
    type: ILabel.Type;
  }
}
