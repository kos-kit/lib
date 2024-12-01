import { Literal } from "@rdfjs/types";
import { Equatable } from "purify-ts-helpers";
import { Identifier } from "../Identifier.js";
import { Label as ILabel } from "../Label.js";

export abstract class Label implements ILabel {
  equals = Label.equals;
  readonly identifier: Identifier;
  readonly literalForm: Literal;
  readonly type: ILabel.Type;

  constructor({
    identifier,
    literalForm,
    type,
  }: {
    identifier: Identifier;
    literalForm: Literal;
    type: ILabel.Type;
  }) {
    this.identifier = identifier;
    this.literalForm = literalForm;
    this.type = type;
  }
}

export namespace Label {
  export function equals(this: ILabel, other: ILabel): Equatable.EqualsResult {
    return Equatable.objectEquals(this, other, {
      type: Equatable.equals,
      literalForm: Equatable.booleanEquals,
    });
  }
}
