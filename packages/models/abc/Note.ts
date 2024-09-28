import { Literal } from "@rdfjs/types";
import { Equatable } from "purify-ts-helpers";
import { Note as INote } from "../index.js";

export class Note implements INote {
  readonly literalForm: Literal;
  readonly type: INote.Type;

  constructor({ literalForm, type }: Note.Parameters) {
    this.literalForm = literalForm;
    this.type = type;
  }

  equals(other: INote): Equatable.EqualsResult {
    return Note.equals(this, other);
  }
}

export namespace Note {
  export function equals(left: INote, right: INote): Equatable.EqualsResult {
    return Equatable.objectEquals(left, right, {
      literalForm: Equatable.booleanEquals,
      type: Equatable.equals,
    });
  }

  export interface Parameters {
    literalForm: Literal;
    type: INote.Type;
  }
}
