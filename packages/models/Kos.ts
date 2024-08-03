import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemesQuery } from "./ConceptSchemesQuery.js";
import { ConceptsQuery } from "./ConceptsQuery.js";
import { Identifier } from "./Identifier.js";
import { Stub } from "./Stub.js";

export interface Kos {
  conceptByIdentifier(identifier: Identifier): Stub<Concept>;
  concepts(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptsQuery;
  }): AsyncGenerator<Stub<Concept>>;
  conceptsCount(query?: ConceptsQuery): Promise<number>;

  conceptSchemeByIdentifier(identifier: Identifier): Stub<ConceptScheme>;
  conceptSchemes(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptSchemesQuery;
  }): AsyncGenerator<Stub<ConceptScheme>>;
  conceptSchemesCount(query?: ConceptSchemesQuery): Promise<number>;
}
