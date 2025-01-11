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
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
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

  conceptSchemeStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeStubT>>;

  conceptSchemeStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<readonly ConceptSchemeStubT[]>;

  conceptSchemesCount(query: ConceptSchemesQuery): Promise<number>;

  conceptStub(identifier: Identifier): Promise<Either<Error, ConceptStubT>>;

  conceptStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<readonly ConceptStubT[]>;

  conceptsCount(query: ConceptsQuery): Promise<number>;
}
