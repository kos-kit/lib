import { Literal } from "@rdfjs/types";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { NoteProperty } from "./NoteProperty.js";
import { LabeledModel } from "./LabeledModel.js";
import { ConceptScheme } from "./ConceptScheme.js";

export interface Concept extends LabeledModel {
  inSchemes(): Promise<readonly ConceptScheme[]>;

  readonly notations: readonly Literal[];

  notes(property: NoteProperty): readonly Literal[];

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;

  topConceptOf(): Promise<readonly ConceptScheme[]>;
}
