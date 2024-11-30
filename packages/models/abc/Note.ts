import { Literal } from "@rdfjs/types";
import { Equatable } from "purify-ts-helpers";
import { Note as INote } from "../Note.js";

export class Note implements INote {
  equals = Note.equals;
  readonly literalForm: Literal;
  readonly type: INote.Type;

  constructor({ literalForm, type }: Note.Parameters) {
    this.literalForm = literalForm;
    this.type = type;
  }
}

export namespace Note {
  export function equals(this: INote, other: INote): Equatable.EqualsResult {
    return Equatable.objectEquals(this, other, {
      literalForm: Equatable.booleanEquals,
      type: Equatable.equals,
    });
  }

  export interface Parameters {
    literalForm: Literal;
    type: INote.Type;
  }
}
