import { Literal } from "@rdfjs/types";
import { Label as ILabel } from "../Label";

/**
 * A Label that only consists of its literal form.
 */
export class Label implements ILabel {
  constructor(readonly literalForm: Literal) {}

  readonly license = null;
  readonly modified = null;
  readonly rights = null;
  readonly rightsHolder = null;
}
