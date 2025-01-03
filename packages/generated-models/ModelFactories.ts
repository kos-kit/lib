import { ModelFactory } from "./ModelFactory.js";
import {
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptStub,
  Identifier,
} from "./index.js";

export interface ModelFactories<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptStubT extends ConceptStub = ConceptStub,
> {
  readonly concept: ModelFactory<ConceptT>;
  readonly conceptScheme: ModelFactory<ConceptSchemeT>;
  readonly conceptSchemeStub: ModelFactory<ConceptSchemeStubT> & {
    fromIdentifier: (identifier: Identifier) => ConceptSchemeStubT;
  };
  readonly conceptStub: ModelFactory<ConceptStubT> & {
    fromIdentifier: (identifier: Identifier) => ConceptStubT;
  };
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
      fromIdentifier: (identifier) => new ConceptSchemeStub({ identifier }),
      fromRdf: ConceptSchemeStub.fromRdf,
      SparqlGraphPatterns: ConceptSchemeStub.SparqlGraphPatterns,
    },
    conceptStub: {
      fromIdentifier: (identifier) => new ConceptStub({ identifier }),
      fromRdf: ConceptStub.fromRdf,
      SparqlGraphPatterns: ConceptStub.SparqlGraphPatterns,
    },
  };
}
