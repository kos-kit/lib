import { Maybe } from "purify-ts";
import { Model } from "./Model.js";

/**
 * A stub model is a placeholder for another model in situations where it's unclear whether the other model is fully resolvable.
 *
 * For example, if one skos:Concept has skos:broader another skos:Concept, we have the identifier of the broader skos:Concept
 * but we may know nothing else about it. In those situations we return a stub model (i.e., StubConcept) with the identifier and
 * let the caller resolve() the actual model as necessary.
 */
export interface StubModel<ModelT extends Model> {
  resolve(): Promise<Maybe<ModelT>>;
}
