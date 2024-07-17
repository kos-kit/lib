import { Maybe } from "purify-ts";
import { LabeledModel } from "./LabeledModel.js";

/**
 * A stub is a placeholder for a model in situations where it's unclear whether the other model is fully resolvable.
 *
 * For example, if one skos:Concept has skos:broader another skos:Concept, we have the identifier of the broader skos:Concept
 * but we may know nothing else about it. In those situations we return a stub model (i.e., ConceptStub) with the identifier and
 * let the caller resolve() the actual model as necessary.
 */
export interface Stub<LabeledModelT extends LabeledModel> {
  readonly displayLabel: string;
  readonly identifier: LabeledModel.Identifier;
  resolve(): Promise<Maybe<LabeledModelT>>;
}
