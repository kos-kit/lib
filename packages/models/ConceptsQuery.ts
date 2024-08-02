import { Identifier } from "./Identifier.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";

export interface ConceptsQuery {
  identifier?: Identifier;
  inScheme?: Identifier;
  semanticRelationOf?: {
    property: SemanticRelationProperty;
    subject: Identifier;
  };
  topConceptOf?: Identifier;
}
