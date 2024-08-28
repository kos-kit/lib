import { Either } from "purify-ts";
import { NamedModel } from "./NamedModel.js";

/**
 * A stub is a placeholder for a model in situations where it's unclear whether the other model is resolvable at all
 * (i.e., a reference to a Concept that may not be defined anywhere) or when the model may need to be retrieved
 * asynchronously in a separate step (from e.g., a SPARQL endpoint).
 *
 * For example, if one skos:Concept has skos:broader another skos:Concept, we have the identifier of the broader skos:Concept
 * but we may know nothing else about it. In those situations we return a stub model (i.e., ConceptStub) with the identifier and
 * let the caller resolve() the actual model as necessary.
 */
export interface Stub<ModelT extends NamedModel> extends NamedModel {
  equals(other: Stub<ModelT>): boolean;

  /**
   * Try to resolve the stub. If the resolution succeeds, return the model as Right. Otherwise return this as Left
   * to support chaining.
   */
  resolve(): Promise<Either<this, ModelT>>;
}
