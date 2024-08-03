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
import { LabeledModel } from "./LabeledModel.js";

export abstract class Concept<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends LabeledModel<ConceptT, ConceptSchemeT, LabelT> {
  abstract readonly modified: Maybe<Literal>;

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

  export type Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
