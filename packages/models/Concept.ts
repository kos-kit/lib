import { Literal } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { StubArray } from "./StubArray.js";

export interface Concept extends LabeledModel {
  readonly notations: readonly Literal[];

  inSchemes(): Promise<StubArray<ConceptScheme>>;
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<StubArray<Concept>>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): Promise<StubArray<ConceptScheme>>;
}

export namespace Concept {
  export type Identifier = LabeledModel.Identifier;

  export namespace Identifier {
    export const fromString = LabeledModel.Identifier.fromString;
    export const toString = LabeledModel.Identifier.toString;
  }
}
