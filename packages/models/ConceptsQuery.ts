import { Identifier } from "./Identifier.js";
import { SemanticRelation } from "./SemanticRelation.js";

export type ConceptsQuery =
  | {
      // All concepts
      readonly type: "All";
    }
  | {
      // Concepts with the given identifiers
      readonly identifiers: readonly Identifier[];
      readonly type: "Identifiers";
    }
  | {
      // Concepts that are in the given concept scheme
      // If conceptIdentifier is supplied, only check if it's in the given concept scheme
      readonly conceptIdentifier?: Identifier;
      readonly conceptSchemeIdentifier: Identifier;
      readonly type: "InScheme";
    }
  | {
      // Object concepts that are semantic relations of the given subject concept
      // i.e. if semanticRelationProperty is skos:broader, then
      // (subjectConceptIdentifier, skos:broader, ?otherConcept)
      readonly semanticRelationType: SemanticRelation.Type;
      readonly subjectConceptIdentifier: Identifier;
      readonly type: "ObjectsOfSemanticRelation";
    }
  | {
      // Subject concepts that are semantic relations of the given object concept
      // i.e. if semanticRelationProperty is skos:broader, then
      // (?otherConcept, skos:broader, objectConceptIdentifier)
      readonly semanticRelationType: SemanticRelation.Type;
      readonly objectConceptIdentifier: Identifier;
      readonly type: "SubjectsOfSemanticRelation";
    }
  | {
      // Concepts that are the top concept of the given concept scheme
      readonly conceptSchemeIdentifier: Identifier;
      readonly type: "TopConceptOf";
    };
