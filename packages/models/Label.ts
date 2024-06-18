import { Literal } from "@rdfjs/types";
import { Model } from "./Model.js";

export interface Label extends Model {
  readonly literalForm: Literal;
}
