import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
} from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Arrays } from "purify-ts-helpers";
import { ConceptStub } from "./ConceptStub.js";
import { LabeledModel } from "./LabeledModel.js";

export abstract class ConceptScheme<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConceptScheme<ConceptT, LabelT>
{
  abstract readonly license: Maybe<Literal | NamedNode>;
  abstract readonly modified: Maybe<Literal>;
  abstract readonly rights: Maybe<Literal>;
  abstract readonly rightsHolder: Maybe<Literal>;

  async conceptByIdentifier(
    identifier: Identifier,
  ): Promise<Maybe<ConceptStub<ConceptT, ConceptSchemeT, LabelT>>> {
    for await (const conceptStub of this.kos.concepts({
      limit: 1,
      offset: 0,
      query: {
        conceptIdentifier: identifier,
        conceptSchemeIdentifier: this.identifier,
        type: "InScheme",
      },
    })) {
      return Maybe.of(conceptStub);
    }
    this.logger.info(
      "concept %s is not part of concept scheme %s",
      Identifier.toString(identifier),
      Identifier.toString(this.identifier),
    );
    return Maybe.empty();
  }

  async *concepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this.kos.concepts({
      limit: null,
      offset: 0,
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

  equals(other: IConceptScheme<any, any>): boolean {
    return ConceptScheme.equals(this, other);
  }

  protected abstract override labelsByType(
    type: ILabel.Type,
  ): readonly ILabel[];

  async *topConcepts(kwds?: {
    limit?: number;
    offset?: number;
  }): AsyncGenerator<ConceptStub<ConceptT, ConceptSchemeT, LabelT>> {
    yield* this.kos.concepts({
      limit: null,
      offset: 0,
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
  export function equals(
    left: IConceptScheme<any, any>,
    right: IConceptScheme<any, any>,
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

    return true;
  }

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
