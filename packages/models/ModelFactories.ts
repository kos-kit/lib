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
      sparqlConstructQueryString: Concept.sparqlConstructQueryString,
    },
    conceptScheme: {
      fromRdf: ConceptScheme.fromRdf,
      sparqlConstructQueryString: ConceptSchemeStub.sparqlConstructQueryString,
    },
    conceptSchemeStub: {
      fromIdentifier: (identifier) => ConceptSchemeStub.create({ identifier }),
      fromRdf: ConceptSchemeStub.fromRdf,
      sparqlConstructQueryString: ConceptSchemeStub.sparqlConstructQueryString,
    },
    conceptStub: {
      fromIdentifier: (identifier) => ConceptStub.create({ identifier }),
      fromRdf: ConceptStub.fromRdf,
      sparqlConstructQueryString: ConceptStub.sparqlConstructQueryString,
    },
  };
}
