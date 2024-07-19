import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Stub } from "./Stub.js";
import { StubArray } from "./StubArray.js";

export class NotImplementedKos implements Kos {
  conceptByIdentifier(_identifier: Concept.Identifier): Stub<Concept> {
    throw new Error("Method not implemented.");
  }

  conceptSchemeByIdentifier(
    _identifier: ConceptScheme.Identifier,
  ): Stub<ConceptScheme> {
    throw new Error("Method not implemented.");
  }

  conceptSchemes(): Promise<StubArray<ConceptScheme>> {
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
  }): Promise<StubArray<Concept>> {
    throw new Error("Method not implemented.");
  }
}
