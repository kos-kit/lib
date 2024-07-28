import { Concept as IConcept, Identifier } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";

export interface ConceptFactory<ConceptT extends IConcept> {
  createConcept(resource: Resource<Identifier>): ConceptT;
}
