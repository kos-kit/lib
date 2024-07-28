import { Identifier } from "./Identifier.js";
import { Model } from "./Model.js";

export interface NamedModel extends Model {
  readonly identifier: Identifier;
}
