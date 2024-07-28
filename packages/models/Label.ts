import { Literal } from "@rdfjs/types";
import { Model } from "./Model.js";

export interface Label extends Model {
  readonly literalForm: Literal;

  equals(other: Label): boolean;
}

export namespace Label {
  export function equals(left: Label, right: Label): boolean {
    return left.literalForm.equals(right.literalForm);
  }
}
