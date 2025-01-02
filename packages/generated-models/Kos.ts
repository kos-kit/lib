import { Either } from "purify-ts";
import {
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptSchemesQuery,
  ConceptStub,
  ConceptsQuery,
  Identifier,
} from "./index.js";

export interface Kos<
  ConceptT extends Concept = Concept,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptStubT extends ConceptStub = ConceptStub,
> {
  concept(identifier: Identifier): Promise<Either<Error, ConceptT>>;

  conceptIdentifiers(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<readonly Identifier[]>;

  conceptScheme(identifier: Identifier): Promise<Either<Error, ConceptSchemeT>>;

  conceptSchemeIdentifiers(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<readonly Identifier[]>;

  conceptSchemeStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<readonly ConceptSchemeStubT[]>;

  conceptSchemesCount(query: ConceptSchemesQuery): Promise<number>;

  conceptStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<readonly ConceptStubT[]>;

  conceptsCount(query: ConceptsQuery): Promise<number>;
}
