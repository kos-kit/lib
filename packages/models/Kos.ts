import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { StubConceptScheme } from "./StubConceptScheme.js";
import { StubConcept } from "./StubConcept.js";

export interface Kos {
  conceptByIdentifier(identifier: Concept.Identifier): StubConcept;
  conceptSchemeByIdentifier(
    identifier: ConceptScheme.Identifier,
  ): StubConceptScheme;
  conceptSchemes(): Promise<readonly StubConceptScheme[]>;
  concepts(): AsyncIterable<StubConcept>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept[]>;
}
