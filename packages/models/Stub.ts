import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Model } from "./Model.js";
import { StubSequence } from "./StubSequence.js";

/**
 * A stub is a placeholder for a model in situations where it's unclear whether the other model is resolvable at all
 * (i.e., a reference to a Concept that may not be defined anywhere) or when the model may need to be retrieved
 * asynchronously in a separate step (from e.g., a SPARQL endpoint).
 *
 * For example, if one skos:Concept has skos:broader another skos:Concept, we have the identifier of the broader skos:Concept
 * but we may know nothing else about it. In those situations we return a stub model (i.e., ConceptStub) with the identifier and
 * let the caller resolve() the actual model as necessary.
 */
export interface Stub<ModelT extends Model>
  extends Equatable<Stub<ModelT>>,
    Model {
  /**
   * Cons this (head) stub to a tail of other stubs to form a StubSequence.
   */
  cons(...tail: readonly Stub<ModelT>[]): StubSequence<ModelT>;

  /**
   * Try to resolve the stub. If the resolution succeeds, return the model as Right. Otherwise return this as Left
   * to support chaining.
   */
  resolve(): Promise<Either<this, ModelT>>;
}
