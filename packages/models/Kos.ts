import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Stub } from "./Stub.js";

export interface Kos {
  conceptByIdentifier(identifier: Concept.Identifier): Stub<Concept>;
  conceptSchemeByIdentifier(
    identifier: ConceptScheme.Identifier,
  ): Stub<ConceptScheme>;
  conceptSchemes(): AsyncGenerator<Stub<ConceptScheme>>;
  concepts(): AsyncGenerator<Stub<Concept>>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Stub<Concept>[]>;
}
