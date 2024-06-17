import { Literal } from "@rdfjs/types";
import { SemanticRelationProperty } from "./SemanticRelationProperty";
import { NoteProperty } from "./NoteProperty";
import { LabeledModel } from "./LabeledModel";
import { ConceptScheme } from "./ConceptScheme";

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
