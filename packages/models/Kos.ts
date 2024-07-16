import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Maybe } from "purify-ts";
import { StubConceptScheme } from "./StubConceptScheme.js";
import { StubConcept } from "./StubConcept.js";

export interface Kos {
  conceptByIdentifier(identifier: Concept.Identifier): Promise<Maybe<Concept>>;
  conceptSchemeByIdentifier(
    identifier: ConceptScheme.Identifier,
  ): Promise<Maybe<ConceptScheme>>;
  conceptSchemes(): Promise<readonly StubConceptScheme[]>;
  concepts(): AsyncIterable<StubConcept>;
  conceptsByIdentifiers(
    identifiers: readonly Concept.Identifier[],
  ): Promise<readonly Maybe<Concept>[]>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept[]>;
}
