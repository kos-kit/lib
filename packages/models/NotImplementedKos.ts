import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemesQuery } from "./ConceptSchemesQuery.js";
import { ConceptsQuery } from "./ConceptsQuery.js";
import { Identifier } from "./Identifier.js";
import { Kos } from "./Kos.js";
import { Label } from "./Label.js";
import { LanguageTagSet } from "./LanguageTagSet.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";

export class NotImplementedKos<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> implements Kos<any, any, any>
{
  get includeLanguageTags(): LanguageTagSet {
    throw new Error("Method not implemented.");
  }

  getConceptByIdentifier(_identifier: Identifier): Stub<ConceptT> {
    throw new Error("Method not implemented.");
  }

  getConceptSchemeByIdentifier(_identifier: Identifier): Stub<ConceptSchemeT> {
    throw new Error("Method not implemented.");
  }

  getConceptSchemesByQuery(_kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>> {
    throw new Error("Method not implemented.");
  }

  getConceptSchemesCountByQuery(_query: ConceptSchemesQuery): Promise<number> {
    throw new Error("Method not implemented.");
  }

  getConceptsByQuery(_kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>> {
    throw new Error("Method not implemented.");
  }

  getConceptsCountByQuery(_query: ConceptsQuery): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
