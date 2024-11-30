import { Identifier } from "./Identifier.js";

export type ConceptSchemesQuery =
  | // All concept schemes
  { readonly type: "All" }
  // Concept schemes that have the given concept in them
  | { conceptIdentifier: Identifier; readonly type: "HasConcept" }
  // Concept schemes that have the given concept as a top concept
  | { conceptIdentifier: Identifier; readonly type: "HasTopConcept" };
