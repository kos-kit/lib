import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemesQuery } from "./ConceptSchemesQuery.js";
import { ConceptsQuery } from "./ConceptsQuery.js";
import { Identifier } from "./Identifier.js";
import { Kos } from "./Kos.js";
import { LanguageTagSet } from "./LanguageTagSet.js";
import { Stub } from "./Stub.js";

export class NotImplementedKos implements Kos<any, any, any> {
  conceptByIdentifier(_identifier: Identifier): Stub<Concept<any, any, any>> {
    throw new Error("Method not implemented.");
  }
  concepts(_kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): AsyncGenerator<Stub<Concept<any, any, any>>> {
    throw new Error("Method not implemented.");
  }
  conceptsCount(_query: ConceptsQuery): Promise<number> {
    throw new Error("Method not implemented.");
  }
  conceptSchemeByIdentifier(
    _identifier: Identifier,
  ): Stub<ConceptScheme<any, any>> {
    throw new Error("Method not implemented.");
  }
  conceptSchemes(_kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): AsyncGenerator<Stub<ConceptScheme<any, any>>> {
    throw new Error("Method not implemented.");
  }
  conceptSchemesCount(_query: ConceptSchemesQuery): Promise<number> {
    throw new Error("Method not implemented.");
  }
  get includeLanguageTags(): LanguageTagSet {
    throw new Error("Method not implemented.");
  }
}
