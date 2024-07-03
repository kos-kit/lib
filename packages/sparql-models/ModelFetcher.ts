import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Maybe } from "purify-ts";

export interface ModelFetcher<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> {
  fetchConceptSchemesByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Maybe<SparqlConceptSchemeT>[]>;

  fetchConceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Maybe<SparqlConceptT>[]>;
}
