import { ModelFactory } from "./ModelFactory.js";
import {
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptStub,
} from "./index.js";

export interface ModelFactories<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptStubT extends ConceptStub = ConceptStub,
> {
  readonly concept: ModelFactory<ConceptT>;
  readonly conceptScheme: ModelFactory<ConceptSchemeT>;
  readonly conceptSchemeStub: ModelFactory<ConceptSchemeStubT>;
  readonly conceptStub: ModelFactory<ConceptStubT>;
}

export namespace ModelFactories {
  export const default_: ModelFactories = {
    concept: {
      fromRdf: Concept.fromRdf,
      SparqlGraphPatterns: Concept.SparqlGraphPatterns,
    },
    conceptScheme: {
      fromRdf: ConceptScheme.fromRdf,
      SparqlGraphPatterns: ConceptScheme.SparqlGraphPatterns,
    },
    conceptSchemeStub: {
      fromRdf: ConceptSchemeStub.fromRdf,
      SparqlGraphPatterns: ConceptSchemeStub.SparqlGraphPatterns,
    },
    conceptStub: {
      fromRdf: ConceptStub.fromRdf,
      SparqlGraphPatterns: ConceptStub.SparqlGraphPatterns,
    },
  };
}
