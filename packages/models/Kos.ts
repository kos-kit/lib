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

  getConceptByIdentifier(identifier: Identifier): Stub<ConceptT>;

  getConceptSchemeByIdentifier(identifier: Identifier): Stub<ConceptSchemeT>;

  getConceptSchemesByQuery(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>>;

  getConceptSchemesCountByQuery(query: ConceptSchemesQuery): Promise<number>;

  getConceptsByQuery(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>>;

  getConceptsCountByQuery(query: ConceptsQuery): Promise<number>;
}
