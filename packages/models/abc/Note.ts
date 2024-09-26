import { Literal } from "@rdfjs/types";
import { Note as INote } from "../index.js";

export class Note implements INote {
  readonly literalForm: Literal;
  readonly type: INote.Type;

  constructor({ literalForm, type }: Note.Parameters) {
    this.literalForm = literalForm;
    this.type = type;
  }

  equals(other: INote): boolean {
    return Note.equals(this, other);
  }
}

export namespace Note {
  export function equals(left: INote, right: INote): boolean {
    if (left.type.equals(right.type)) {
      return false;
    }

    if (!left.literalForm.equals(right.literalForm)) {
      return false;
    }

    return true;
  }

  export interface Parameters {
    literalForm: Literal;
    type: INote.Type;
  }
}
