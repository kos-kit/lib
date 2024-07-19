import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Stub } from "./Stub.js";
import { StubArray } from "./StubArray.js";

export interface Kos {
  conceptByIdentifier(identifier: Concept.Identifier): Stub<Concept>;
  conceptSchemeByIdentifier(
    identifier: ConceptScheme.Identifier,
  ): Stub<ConceptScheme>;
  conceptSchemes(): Promise<StubArray<ConceptScheme>>;
  concepts(): AsyncGenerator<Stub<Concept>>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<StubArray<Concept>>;
}
