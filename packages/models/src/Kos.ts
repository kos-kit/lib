import { Either } from "purify-ts";
import {
  Concept,
  ConceptQuery,
  ConceptScheme,
  ConceptSchemeQuery,
  ConceptSchemeStub,
  ConceptStub,
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
    query: ConceptQuery;
  }): Promise<Either<Error, readonly Identifier[]>>;

  concepts(
    identifiers: readonly Identifier[],
  ): Promise<readonly Either<Error, ConceptT>[]>;

  conceptScheme(identifier: Identifier): Promise<Either<Error, ConceptSchemeT>>;

  conceptSchemeIdentifiers(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<Either<Error, readonly Identifier[]>>;

  conceptSchemeStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeStubT>>;

  conceptSchemeStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<Either<Error, readonly ConceptSchemeStubT[]>>;

  conceptSchemesCount(
    query: ConceptSchemeQuery,
  ): Promise<Either<Error, number>>;

  conceptStub(identifier: Identifier): Promise<Either<Error, ConceptStubT>>;

  conceptStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<Either<Error, readonly ConceptStubT[]>>;

  conceptsCount(query: ConceptQuery): Promise<Either<Error, number>>;
}
