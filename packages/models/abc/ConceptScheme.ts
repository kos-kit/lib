import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
} from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Arrays } from "purify-ts-helpers";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";

export abstract class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConceptScheme
{
  abstract readonly license: Maybe<Literal | NamedNode>;
  abstract readonly modified: Maybe<Literal>;
  abstract readonly rights: Maybe<Literal>;
  abstract readonly rightsHolder: Maybe<Literal>;

  async conceptByIdentifier(
    identifier: Identifier,
  ): Promise<Maybe<Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>>> {
    for await (const conceptStub of this.kos.concepts({
      limit: 1,
      query: {
        conceptIdentifier: identifier,
        conceptSchemeIdentifier: this.identifier,
        type: "InScheme",
      },
    })) {
      return Maybe.of(conceptStub);
    }
    return Maybe.empty();
  }

  async *concepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>
  > {
    yield* this.kos.concepts({
      query: { conceptSchemeIdentifier: this.identifier, type: "InScheme" },
      ...kwds,
    });
  }

  conceptsCount(): Promise<number> {
    return this.kos.conceptsCount({
      conceptSchemeIdentifier: this.identifier,
      type: "InScheme",
    });
  }

  equals(other: IConceptScheme): boolean {
    return ConceptScheme.equals(this, other);
  }

  protected abstract override labelsByType(
    type: ILabel.Type,
  ): readonly ILabel[];

  async *topConcepts(kwds?: {
    limit?: number;
    offset?: number;
  }): AsyncGenerator<Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>> {
    yield* this.kos.concepts({
      query: { conceptSchemeIdentifier: this.identifier, type: "TopConceptOf" },
      ...kwds,
    });
  }

  topConceptsCount(): Promise<number> {
    return this.kos.conceptsCount({
      conceptSchemeIdentifier: this.identifier,
      type: "TopConceptOf",
    });
  }
}

export namespace ConceptScheme {
  export function equals(left: IConceptScheme, right: IConceptScheme): boolean {
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

    return true;
  }

  export type Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
