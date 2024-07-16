import { Literal } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { StubConcept } from "./StubConcept.js";
import { StubConceptScheme } from "./StubConceptScheme.js";

export interface Concept extends LabeledModel {
  readonly notations: readonly Literal[];

  inSchemes(): Promise<readonly StubConceptScheme[]>;
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly StubConcept[]>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): Promise<readonly StubConceptScheme[]>;
}

export namespace Concept {
  export type Identifier = LabeledModel.Identifier;

  export namespace Identifier {
    export const fromString = LabeledModel.fromString;
    export const toString = LabeledModel.toString;
  }
}
