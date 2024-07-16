import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { StubConceptScheme } from "./StubConceptScheme.js";
import { StubConcept } from "./StubConcept.js";
import { Maybe } from "purify-ts";

export class NotImplementedKos implements Kos {
  conceptByIdentifier(
    _identifier: Concept.Identifier,
  ): Promise<Maybe<Concept>> {
    throw new Error("Method not implemented.");
  }

  conceptSchemeByIdentifier(
    _identifier: ConceptScheme.Identifier,
  ): Promise<Maybe<ConceptScheme>> {
    throw new Error("Method not implemented.");
  }

  conceptSchemes(): Promise<readonly StubConceptScheme[]> {
    throw new Error("Method not implemented.");
  }

  concepts(): AsyncIterable<StubConcept> {
    throw new Error("Method not implemented.");
  }

  conceptsCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  conceptsPage(_kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept[]> {
    throw new Error("Method not implemented.");
  }
}
