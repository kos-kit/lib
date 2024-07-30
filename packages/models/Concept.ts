import { Literal } from "@rdfjs/types";
import { Arrays } from "purify-ts-helpers";
import { ConceptScheme } from "./ConceptScheme.js";
import { LabelsMixin } from "./LabelsMixin.js";
import { NamedModel } from "./NamedModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { ProvenanceMixin } from "./ProvenanceMixin.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { Stub } from "./Stub.js";

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
