import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Stub } from "./Stub.js";

export class NotImplementedKos implements Kos {
  conceptByIdentifier(_identifier: Concept.Identifier): Stub<Concept> {
    throw new Error("Method not implemented.");
  }

  conceptSchemeByIdentifier(
    _identifier: ConceptScheme.Identifier,
  ): Stub<ConceptScheme> {
    throw new Error("Method not implemented.");
  }

  conceptSchemes(): AsyncGenerator<Stub<ConceptScheme>> {
    throw new Error("Method not implemented.");
  }

  concepts(): AsyncGenerator<Stub<Concept>> {
    throw new Error("Method not implemented.");
  }

  conceptsCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  conceptsPage(_kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Stub<Concept>[]> {
    throw new Error("Method not implemented.");
  }
}
