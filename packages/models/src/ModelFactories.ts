import { ModelFactory } from "./ModelFactory.js";
import {
  Concept,
  ConceptScheme,
  Identifier,
  PartialConcept,
  PartialConceptScheme,
} from "./index.js";

export interface ModelFactories<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends PartialConceptScheme = PartialConceptScheme,
  ConceptStubT extends PartialConcept = PartialConcept,
> {
  readonly concept: ModelFactory<ConceptT>;
  readonly conceptScheme: ModelFactory<ConceptSchemeT>;
  readonly conceptSchemeStub: ModelFactory<ConceptSchemeStubT> & {
    $fromIdentifier: (identifier: Identifier) => ConceptSchemeStubT;
  };
  readonly conceptStub: ModelFactory<ConceptStubT> & {
    $fromIdentifier: (identifier: Identifier) => ConceptStubT;
  };
}

export namespace ModelFactories {
  export const default_: ModelFactories = {
    concept: Concept,
    conceptScheme: ConceptScheme,
    conceptSchemeStub: {
      $fromIdentifier: ($identifier) =>
        PartialConceptScheme.$create({ $identifier }),
      $fromRdf: PartialConceptScheme.$fromRdf,
      $sparqlConstructQueryString:
        PartialConceptScheme.$sparqlConstructQueryString,
    },
    conceptStub: {
      $fromIdentifier: ($identifier) => PartialConcept.$create({ $identifier }),
      $fromRdf: PartialConcept.$fromRdf,
      $sparqlConstructQueryString: PartialConcept.$sparqlConstructQueryString,
    },
  };
}
