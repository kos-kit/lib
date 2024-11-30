import TermSet from "@rdfjs/term-set";
import { Equatable } from "purify-ts-helpers";
import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { Identifier } from "../Identifier.js";
import { Label as ILabel } from "../Label.js";
import { SemanticRelation } from "../SemanticRelation.js";
import { Stub } from "../Stub.js";
import { StubSequence } from "../StubSequence.js";
import { UnbatchedStubSequence } from "../UnbatchedStubSequence.js";
import { Resource } from "./Resource.js";

export abstract class Concept<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >
  extends Resource<ConceptT, ConceptSchemeT, LabelT>
  implements IConcept<ConceptT, ConceptSchemeT, LabelT>
{
  equals(other: ConceptT): Equatable.EqualsResult {
    // This is a method and not an assignment to the function so it can be overridden in subclasses
    return Concept.equals.bind(this)(other);
  }

  async inSchemes(): Promise<StubSequence<ConceptSchemeT>> {
    return this.kos.conceptSchemesByQuery({
      limit: null,
      offset: 0,
      query: { conceptIdentifier: this.identifier, type: "HasConcept" },
    });
  }

  async semanticRelations(
    type: SemanticRelation.Type,
    options?: { includeInverse?: false },
  ): Promise<StubSequence<ConceptT>> {
    const conceptIdentifiers = new TermSet<Identifier>();
    const conceptStubs: Stub<ConceptT>[] = [];

    for (const conceptStub of await this.kos.conceptsByQuery({
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
        for (const conceptStub of await this.kos.conceptsByQuery({
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
    return this.kos.conceptSchemesByQuery({
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
    return Resource.resourceEquals
      .bind(this)(other)
      .chain(() =>
        Equatable.objectEquals(this, other, {
          identifier: Equatable.booleanEquals,
        }),
      );
  }

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = Resource.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
