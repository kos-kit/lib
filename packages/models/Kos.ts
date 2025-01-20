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
  }): Promise<readonly Identifier[]>;

  conceptScheme(identifier: Identifier): Promise<Either<Error, ConceptSchemeT>>;

  conceptSchemeIdentifiers(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<readonly Identifier[]>;

  conceptSchemeStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeStubT>>;

  conceptSchemeStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<readonly ConceptSchemeStubT[]>;

  conceptSchemesCount(query: ConceptSchemeQuery): Promise<number>;

  conceptStub(identifier: Identifier): Promise<Either<Error, ConceptStubT>>;

  conceptStubs(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<readonly ConceptStubT[]>;

  conceptsCount(query: ConceptQuery): Promise<number>;
}
