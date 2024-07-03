import { Literal } from "@rdfjs/types";
import { Label } from "./Label.js";
import * as O from "fp-ts/Option";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  readonly license = O.none;
  readonly modified = O.none;
  readonly rights = O.none;
  readonly rightsHolder = O.none;

  constructor(readonly literalForm: Literal) {}
}
