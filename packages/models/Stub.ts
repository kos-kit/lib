import { Maybe } from "purify-ts";
import { NamedModel } from "./NamedModel.js";

/**
 * A stub is a placeholder for a model in situations where it's unclear whether the other model is resolvable at all
 * (i.e., a reference to a Concept that may not be defined anywhere) or when the model may need to be retrieved
 * asynchronously in a separate step (from e.g., a SPARQL endpoint).
 *
 * For example, if one skos:Concept has skos:broader another skos:Concept, we have the identifier of the broader skos:Concept
 * but we may know nothing else about it. In those situations we return a stub model (i.e., ConceptStub) with the identifier and
 * let the caller resolve() the actual model as necessary.
 *
 * Rules for consistent use of Stubs:
 * - Any model added independently of other models should be referenced by Stub. For example, Workflow is added
 *    independently (via ModelSet.addWorkflow) of WorkflowExecution (via ModelSet.addWorkflowExecution). WorkflowExecution
 *    and its parts references Workflow and its parts by Stub.
 * - Any model that has its own page in the GUI should be referenced by Stub: Annotation, Concept, Document, et al.
 *
 * Current models that should normally be referenced by Stub:
 * - Annotation
 * - Concept
 * - ConceptScheme
 * - Corpus
 * - Document and its parts such as TextualEntity
 * - Workflow and its parts
 * - WorkflowExecution and its parts
 *
 * A process that outputs a model should inline that model as the "original" instance of that model.
 * For example, Annotations are typically inlined by the AnnotatorExecution that produces them. The AnnotatorExecution
 * is inlined by a WorkflowExecution in turn. In other contexts Annotations should be referenced by Stub.
 *
 * All other model uses should be inlined instead of referenced by Stub.
 *
 * Outside of ModelSet implementations, Stub instances should only be created by calling ModelSet *ByIdentifier methods.
 */
export interface Stub<ModelT extends NamedModel> extends NamedModel {
  equals(other: Stub<ModelT>): boolean;

  resolve(): Promise<Maybe<ModelT>>;

  /**
   * Resolve a stub, returning the model if successfully resolved, else the stub.
   */
  resolveOrStub(): Promise<NamedModel>;
}
