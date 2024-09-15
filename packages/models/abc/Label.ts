import { Literal } from "@rdfjs/types";
import { Label as ILabel, Identifier } from "../index.js";

export abstract class Label implements ILabel {
  readonly identifier: Identifier;
  readonly literalForm: Literal;
  readonly type: ILabel.Type;

  constructor({ identifier, literalForm, type }: Label.Parameters) {
    this.identifier = identifier;
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
    if (left.type.equals(right.type)) {
      return false;
    }

    if (!left.literalForm.equals(right.literalForm)) {
      return false;
    }

    return true;
  }

  export interface Parameters {
    identifier: Identifier;
    literalForm: Literal;
    type: ILabel.Type;
  }
}
