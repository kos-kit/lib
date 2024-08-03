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
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { Kos } from "./Kos.js";
import { LabeledModel } from "./LabeledModel.js";
import { NamedModel } from "./NamedModel.js";

export abstract class Concept<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends LabeledModel {
  abstract readonly modified: Maybe<Literal>;

  protected readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;

  constructor({
    kos,
    ...superParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.kos = kos;
  }

  equals(other: IConcept): boolean {
    return Concept.equals(this, other);
  }

  async *inSchemes(): AsyncGenerator<
    ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this.kos.conceptSchemes({ query: { hasConcept: this.identifier } });
  }

  abstract readonly notations: readonly Literal[];

  abstract notes(property: NoteProperty): readonly Literal[];

  async *semanticRelations(
    property: SemanticRelationProperty,
  ): AsyncGenerator<ConceptStub<ConceptT, ConceptSchemeT, LabelT>> {
    yield* this.kos.concepts({
      query: { semanticRelationOf: { property, subject: this.identifier } },
    });
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return this.kos.conceptsCount({
      semanticRelationOf: { property, subject: this.identifier },
    });
  }

  async *topConceptOf(): AsyncGenerator<
    ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this.kos.conceptSchemes({
      query: { hasTopConcept: this.identifier },
    });
  }
}

export namespace Concept {
  export function equals(left: IConcept, right: IConcept): boolean {
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

  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends NamedModel.Parameters {
    kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
  }
}
