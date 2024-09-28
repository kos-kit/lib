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
  abstract readonly modified: Maybe<Literal>;
  abstract readonly notations: readonly Literal[];

  equals(other: IConcept<any, any, any>): Equatable.EqualsResult {
    return Concept.equals(this, other);
  }

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
    left: IConcept<any, any, any>,
    right: IConcept<any, any, any>,
  ): Equatable.EqualsResult {
    return Equatable.propertyEquals(left, right, "identifier")
      .chain(() =>
        Equatable.propertyEquals(
          left,
          right,
          "labels",
          Equatable.arrayEquals(left.labels(), right.labels()),
        ),
      )
      .chain(() =>
        Equatable.propertyEquals(
          left,
          right,
          "notations",
          Arrays.equals(left.notations, right.notations, (left, right) =>
            left.equals(right),
          ),
        ),
      );
  }

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
