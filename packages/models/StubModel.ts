import { Maybe } from "purify-ts";
import { Model } from "./Model.js";

export interface StubModel<ModelT extends Model> {
  resolve(): Promise<Maybe<ModelT>>;
}
