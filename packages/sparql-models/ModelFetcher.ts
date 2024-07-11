import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Maybe } from "purify-ts";

export interface ModelFetcher<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> {
  fetchConceptSchemesByIdentifiers(
    identifiers: readonly IConceptScheme.Identifier[],
  ): Promise<readonly Maybe<SparqlConceptSchemeT>[]>;

  fetchConceptsByIdentifiers(
    identifiers: readonly IConcept.Identifier[],
  ): Promise<readonly Maybe<SparqlConceptT>[]>;
}
