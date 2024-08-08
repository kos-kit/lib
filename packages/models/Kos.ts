import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemesQuery } from "./ConceptSchemesQuery.js";
import { ConceptsQuery } from "./ConceptsQuery.js";
import { Identifier } from "./Identifier.js";
import { Label } from "./Label.js";
import { Stub } from "./Stub.js";

export interface Kos<
  ConceptT extends Concept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> {
  conceptByIdentifier(identifier: Identifier): Stub<ConceptT>;
  concepts(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): AsyncGenerator<Stub<ConceptT>>;
  conceptsCount(query: ConceptsQuery): Promise<number>;

  conceptSchemeByIdentifier(identifier: Identifier): Stub<ConceptSchemeT>;
  conceptSchemes(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): AsyncGenerator<Stub<ConceptSchemeT>>;
  conceptSchemesCount(query: ConceptSchemesQuery): Promise<number>;
}
