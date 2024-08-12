import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  NoteProperty,
  SemanticRelationProperty,
  Stub,
  inverseSemanticRelationProperty,
} from "@kos-kit/models";
import TermSet from "@rdfjs/term-set";
import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Arrays } from "purify-ts-helpers";
import { LabeledModel } from "./LabeledModel.js";

export abstract class Concept<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConcept<ConceptT, ConceptSchemeT, LabelT>
{
  abstract readonly modified: Maybe<Literal>;

  equals(other: IConcept<any, any, any>): boolean {
    return Concept.equals(this, other);
  }

  async *inSchemes(): AsyncGenerator<Stub<ConceptSchemeT>> {
    yield* this.kos.conceptSchemes({
      limit: null,
      offset: 0,
      query: { conceptIdentifier: this.identifier, type: "HasConcept" },
    });
  }

  abstract readonly notations: readonly Literal[];

  abstract notes(property: NoteProperty): readonly Literal[];

  async *semanticRelations(
    property: SemanticRelationProperty,
    options?: { includeInverse?: false },
  ): AsyncGenerator<Stub<ConceptT>> {
    const yieldedConceptIdentifiers = new TermSet<Identifier>();

    for await (const conceptStub of this.kos.concepts({
      limit: null,
      offset: 0,
      query: {
        semanticRelationProperty: property,
        subjectConceptIdentifier: this.identifier,
        type: "ObjectsOfSemanticRelation",
      },
    })) {
      if (!yieldedConceptIdentifiers.has(conceptStub.identifier)) {
        yield conceptStub;
        yieldedConceptIdentifiers.add(conceptStub.identifier);
      }
    }

    if (options?.includeInverse) {
      const inverseProperty =
        inverseSemanticRelationProperty(property).extractNullable();
      if (inverseProperty !== null) {
        for await (const conceptStub of this.kos.concepts({
          limit: null,
          offset: 0,
          query: {
            objectConceptIdentifier: this.identifier,
            semanticRelationProperty: inverseProperty,
            type: "SubjectsOfSemanticRelation",
          },
        })) {
          if (!yieldedConceptIdentifiers.has(conceptStub.identifier)) {
            yield conceptStub;
            yieldedConceptIdentifiers.add(conceptStub.identifier);
          }
        }
      }
    }
  }

  async semanticRelationsCount(
    property: SemanticRelationProperty,
  ): Promise<number> {
    return this.kos.conceptsCount({
      semanticRelationProperty: property,
      subjectConceptIdentifier: this.identifier,
      type: "ObjectsOfSemanticRelation",
    });
  }

  async *topConceptOf(): AsyncGenerator<Stub<ConceptSchemeT>> {
    yield* this.kos.conceptSchemes({
      limit: null,
      offset: 0,
      query: { conceptIdentifier: this.identifier, type: "HasTopConcept" },
    });
  }
}

export namespace Concept {
  export function equals(
    left: IConcept<any, any, any>,
    right: IConcept<any, any, any>,
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
