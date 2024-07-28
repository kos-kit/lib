import { ConceptScheme as IConceptScheme, Identifier } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";

export interface ConceptSchemeFactory<ConceptSchemeT extends IConceptScheme> {
  createConceptScheme(resource: Resource<Identifier>): ConceptSchemeT;
}
