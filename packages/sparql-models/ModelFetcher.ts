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
  fetchConceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Option<SparqlConceptT>[]>;

  fetchConceptSchemesByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Option<SparqlConceptSchemeT>[]>;
}
