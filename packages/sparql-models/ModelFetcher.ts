import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Identifier,
} from "@kos-kit/models";
import { Maybe } from "purify-ts";

export interface ModelFetcher<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> {
  fetchConceptSchemesByIdentifiers(
    identifiers: readonly Identifier[],
  ): Promise<readonly Maybe<SparqlConceptSchemeT>[]>;

  fetchConceptsByIdentifiers(
    identifiers: readonly Identifier[],
  ): Promise<readonly Maybe<SparqlConceptT>[]>;
}
