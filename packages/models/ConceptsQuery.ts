import { Identifier } from "./Identifier.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";

export type ConceptsQuery =
  | {
      // Concepts that are in the given concept scheme
      // If conceptIdentifier is supplied, only check if it's in the given concept scheme
      readonly conceptIdentifier?: Identifier;
      readonly conceptSchemeIdentifier: Identifier;
      readonly type: "InScheme";
    }
  | {
      // Concepts that are semantic relations of the given subject concept
      // i.e. if semanticRelationProperty is skos:broader, then
      // (subjectConceptIdentifier, skos:broader, ?otherConcept)
      readonly semanticRelationProperty: SemanticRelationProperty;
      readonly subjectConceptIdentifier: Identifier;
      readonly type: "ObjectsOfSemanticRelation";
    }
  | {
      // Concepts that are the top concept of the given concept scheme
      readonly conceptSchemeIdentifier: Identifier;
      readonly type: "TopConceptOf";
    };
