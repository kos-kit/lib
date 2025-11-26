import { Identifier } from "./index.js";

export type ConceptSchemeQuery =
  | // All concept schemes
  { readonly type: "All" }
  // Concept schemes that have the given concept in them
  | { conceptIdentifier: Identifier; readonly type: "HasConcept" }
  // Concept schemes that have the given concept as a top concept
  | { conceptIdentifier: Identifier; readonly type: "HasTopConcept" };
