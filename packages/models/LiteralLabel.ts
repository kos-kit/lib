import { Literal } from "@rdfjs/types";
import { abc } from ".";
import { Label } from "./Label.js";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  readonly literalForm: Literal;
  readonly type: Label.Type;

  constructor({
    literalForm,
    type,
  }: { literalForm: Literal; type: Label.Type }) {
    this.literalForm = literalForm;
    this.type = type;
  }

  get displayLabel(): string {
    return this.literalForm.value;
  }

  equals(other: Label): boolean {
    return abc.Label.equals(this, other);
  }
}
