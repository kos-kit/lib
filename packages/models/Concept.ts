import { Literal } from "@rdfjs/types";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Stub } from "./Stub.js";
import { LabelsMixin } from "./LabelsMixin.js";
import { ProvenanceMixin } from "./ProvenanceMixin.js";
import { Arrays } from "./Arrays.js";
import { NamedModel } from "./NamedModel.js";

export interface Concept extends LabelsMixin, NamedModel, ProvenanceMixin {
  readonly notations: readonly Literal[];

  equals(other: Concept): boolean;
  inSchemes(): Promise<readonly Stub<ConceptScheme>[]>;
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Stub<Concept>[]>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): Promise<readonly Stub<ConceptScheme>[]>;
}

export namespace Concept {
  export function equals(left: Concept, right: Concept): boolean {
    if (!left.identifier.equals(right.identifier)) {
      return false;
    }

    if (!LabelsMixin.equals(left, right)) {
      return false;
    }

    if (!ProvenanceMixin.equals(left, right)) {
      return false;
    }

    if (
      !Arrays.equals(left.notations, right.notations, (left, right) =>
        left.equals(right),
      )
    ) {
      return false;
    }

    return true;
  }
}
