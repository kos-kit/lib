import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  Note,
  SemanticRelation,
  Stub,
  StubSequence,
  UnbatchedStubSequence,
} from "@kos-kit/models";
import TermSet from "@rdfjs/term-set";
import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Arrays, Equatable } from "purify-ts-helpers";
import { LabeledModel } from "./LabeledModel.js";

export abstract class Concept<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConcept<ConceptT, ConceptSchemeT, LabelT>
{
  equals = Concept.equals;
  abstract readonly modified: Maybe<Literal>;
  abstract readonly notations: readonly Literal[];

  async inSchemes(): Promise<StubSequence<ConceptSchemeT>> {
    return this.kos.conceptSchemes({
      limit: null,
      offset: 0,
      query: { conceptIdentifier: this.identifier, type: "HasConcept" },
    });
  }

  abstract notes(options?: { types?: readonly Note.Type[] }): readonly Note[];

  async semanticRelations(
    type: SemanticRelation.Type,
    options?: { includeInverse?: false },
  ): Promise<StubSequence<ConceptT>> {
    const conceptIdentifiers = new TermSet<Identifier>();
    const conceptStubs: Stub<ConceptT>[] = [];

    for (const conceptStub of await this.kos.concepts({
      limit: null,
      offset: 0,
      query: {
        semanticRelationType: type,
        subjectConceptIdentifier: this.identifier,
        type: "ObjectsOfSemanticRelation",
      },
    })) {
      if (!conceptIdentifiers.has(conceptStub.identifier)) {
        conceptIdentifiers.add(conceptStub.identifier);
        conceptStubs.push(conceptStub);
      }
    }

    if (options?.includeInverse) {
      const inverseProperty = type.inverse.extractNullable();
      if (inverseProperty !== null) {
        for (const conceptStub of await this.kos.concepts({
          limit: null,
          offset: 0,
          query: {
            objectConceptIdentifier: this.identifier,
            semanticRelationType: inverseProperty,
            type: "SubjectsOfSemanticRelation",
          },
        })) {
          if (!conceptIdentifiers.has(conceptStub.identifier)) {
            conceptIdentifiers.add(conceptStub.identifier);
            conceptStubs.push(conceptStub);
          }
        }
      }
    }

    return new UnbatchedStubSequence(conceptStubs);
  }

  topConceptOf(): Promise<StubSequence<ConceptSchemeT>> {
    return this.kos.conceptSchemes({
      limit: null,
      offset: 0,
      query: { conceptIdentifier: this.identifier, type: "HasTopConcept" },
    });
  }
}

export namespace Concept {
  export function equals(
    this: IConcept<any, any, any>,
    other: IConcept<any, any, any>,
  ): Equatable.EqualsResult {
    return Equatable.objectEquals(this, other, {
      identifier: Equatable.booleanEquals,
      labels: (left, right) =>
        Arrays.equals(left(), right(), (left, right) => left.equals(right)),
      notations: (left, right) =>
        Arrays.equals(left, right, (left, right) => left.equals(right)),
    });
  }

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
