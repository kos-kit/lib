import { Identifier } from "./Identifier.js";

export interface ConceptSchemesQuery {
  hasConcept?: Identifier;
  hasTopConcept?: Identifier;
}
