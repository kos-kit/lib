import { Literal } from "@rdfjs/types";
import { Label } from "./Label.js";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  constructor(readonly literalForm: Literal) {}

  readonly license = null;
  readonly modified = null;
  readonly rights = null;
  readonly rightsHolder = null;
}
