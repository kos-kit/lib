import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { ConceptScheme } from "./ConceptScheme.js";
import { LabeledModel } from "./LabeledModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { Stub } from "./Stub.js";

export interface Concept extends LabeledModel {
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  equals(other: Concept): boolean;
  inSchemes(): AsyncGenerator<Stub<ConceptScheme>>;
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
  ): AsyncGenerator<Stub<Concept>>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): AsyncGenerator<Stub<ConceptScheme>>;
}
