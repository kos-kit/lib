import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";

export interface ModelFetcher<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> {
  fetchConceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly SparqlConceptT[]>;

  fetchConceptSchemesByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly SparqlConceptSchemeT[]>;
}
