import { Literal } from "@rdfjs/types";
import { Label } from "./Label.js";
import { Nothing } from "purify-ts";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  readonly license = Nothing;
  readonly modified = Nothing;
  readonly rights = Nothing;
  readonly rightsHolder = Nothing;

  constructor(readonly literalForm: Literal) {}
}
