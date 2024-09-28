import { Literal } from "@rdfjs/types";
import { Equatable } from "purify-ts-helpers";
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

  equals(other: ILabel): Equatable.EqualsResult {
    return Label.equals(this, other);
  }
}

export namespace Label {
  export function equals(left: ILabel, right: ILabel): Equatable.EqualsResult {
    return Equatable.propertyEquals(left, right, "type").chain(() =>
      Equatable.propertyEquals(left, right, "literalForm"),
    );
  }

  export interface Parameters {
    identifier: Identifier;
    literalForm: Literal;
    type: ILabel.Type;
  }
}
