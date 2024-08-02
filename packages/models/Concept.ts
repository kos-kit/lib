import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { NamedModel } from "./NamedModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { Stub } from "./Stub.js";

export interface Concept extends NamedModel {
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  equals(other: Concept): boolean;
  inSchemes(): AsyncGenerator<Stub<ConceptScheme>>;
  labels(type?: Label.Type): readonly Label[];
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
  ): AsyncGenerator<Stub<Concept>>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): AsyncGenerator<Stub<ConceptScheme>>;
}
