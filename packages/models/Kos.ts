import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemesQuery } from "./ConceptSchemesQuery.js";
import { ConceptsQuery } from "./ConceptsQuery.js";
import { Identifier } from "./Identifier.js";
import { Label } from "./Label.js";
import { LanguageTagSet } from "./LanguageTagSet.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";

export interface Kos<
  ConceptT extends Concept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> {
  readonly includeLanguageTags: LanguageTagSet;

  concept(identifier: Identifier): Stub<ConceptT>;

  conceptScheme(identifier: Identifier): Stub<ConceptSchemeT>;

  conceptSchemes(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>>;

  conceptSchemesCount(query: ConceptSchemesQuery): Promise<number>;

  concepts(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>>;

  conceptsCount(query: ConceptsQuery): Promise<number>;
}
