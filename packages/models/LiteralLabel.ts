import { Literal } from "@rdfjs/types";
import { Equatable } from "purify-ts-helpers";
import { Label } from "./Label.js";
import * as abc from "./abc/index.js";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  readonly literalForm: Literal;
  readonly type: Label.Type;

  constructor({
    literalForm,
    type,
  }: {
    literalForm: Literal;
    type: Label.Type;
  }) {
    this.literalForm = literalForm;
    this.type = type;
  }

  equals(other: Label): Equatable.EqualsResult {
    return abc.Label.equals(this, other);
  }
}
