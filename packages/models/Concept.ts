import { Literal } from "@rdfjs/types";
import { ConceptScheme } from "./ConceptScheme.js";
import { LabeledModel } from "./LabeledModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";

export interface Concept extends LabeledModel {
  readonly notations: readonly Literal[];

  inSchemes(): Promise<readonly ConceptScheme[]>;
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): Promise<readonly ConceptScheme[]>;
}

export namespace Concept {
  export type Identifier = LabeledModel.Identifier;

  export namespace Identifier {
    export const fromString = LabeledModel.fromString;
    export const toString = LabeledModel.toString;
  }
}
