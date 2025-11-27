import { Identifier, SemanticRelationProperty } from "./index.js";

export type ConceptQuery =
  | {
      // All concepts
      readonly type: "All";
    }
  | {
      // Concepts with the given identifiers
      readonly conceptIdentifiers: readonly Identifier[];
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
      readonly inverseSemanticRelationProperties?: boolean;
      readonly semanticRelationProperties: readonly SemanticRelationProperty[];
      readonly subjectConceptIdentifier: Identifier;
      readonly type: "ObjectsOfSemanticRelations";
    }
  | {
      // Subject concepts that are semantic relations of the given object concept
      // i.e. if semanticRelationProperty is skos:broader, then
      // (?otherConcept, skos:broader, objectConceptIdentifier)
      readonly inverseSemanticRelationProperties?: boolean;
      readonly semanticRelationProperties: readonly SemanticRelationProperty[];
      readonly objectConceptIdentifier: Identifier;
      readonly type: "SubjectsOfSemanticRelations";
    }
  | {
      // Concepts that are the top concept of the given concept scheme
      readonly conceptSchemeIdentifier: Identifier;
      readonly type: "TopConceptOf";
    };
