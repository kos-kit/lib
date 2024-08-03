import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Arrays } from "purify-ts-helpers";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";

export abstract class Concept<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConcept<ConceptT, ConceptSchemeT, LabelT>
{
  abstract readonly modified: Maybe<Literal>;

  equals(other: IConcept<ConceptT, ConceptSchemeT, LabelT>): boolean {
    return Concept.equals(this, other);
  }

  async *inSchemes(): AsyncGenerator<
    Stub<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT>
  > {
    yield* this.kos.conceptSchemes({
      query: { conceptIdentifier: this.identifier, type: "HasConcept" },
    });
  }

  abstract readonly notations: readonly Literal[];

  abstract notes(property: NoteProperty): readonly Literal[];

  async *semanticRelations(
    property: SemanticRelationProperty,
  ): AsyncGenerator<Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>> {
    yield* this.kos.concepts({
      query: {
        semanticRelationProperty: property,
        subjectConceptIdentifier: this.identifier,
        type: "SemanticRelationOf",
      },
    });
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return this.kos.conceptsCount({
      semanticRelationProperty: property,
      subjectConceptIdentifier: this.identifier,
      type: "SemanticRelationOf",
    });
  }

  async *topConceptOf(): AsyncGenerator<
    Stub<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT>
  > {
    yield* this.kos.conceptSchemes({
      query: { conceptIdentifier: this.identifier, type: "HasTopConcept" },
    });
  }
}

export namespace Concept {
  export function equals<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >(
    left: IConcept<ConceptT, ConceptSchemeT, LabelT>,
    right: IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ): boolean {
    if (!left.identifier.equals(right.identifier)) {
      return false;
    }

    if (
      !Arrays.equals(left.labels(), right.labels(), (left, right) =>
        left.equals(right),
      )
    ) {
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

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
