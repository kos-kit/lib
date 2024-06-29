import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Option } from "fp-ts/Option";

export interface ModelFetcher<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> {
  fetchConceptSchemesByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Option<SparqlConceptSchemeT>[]>;
  fetchConceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Option<SparqlConceptT>[]>;
}
