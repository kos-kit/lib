import { Literal, NamedNode } from "@rdfjs/types";
import { Label } from "./Label.js";
import { Maybe, Nothing } from "purify-ts";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  readonly license: Maybe<NamedNode | Literal> = Nothing;
  readonly modified: Maybe<Literal> = Nothing;
  readonly rights: Maybe<Literal> = Nothing;
  readonly rightsHolder: Maybe<Literal> = Nothing;

  constructor(readonly literalForm: Literal) {}

  get displayLabel(): string {
    return this.literalForm.value;
  }

  equals(other: Label): boolean {
    return Label.equals(this, other);
  }
}
