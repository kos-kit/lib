import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  Stub,
  StubSequence,
} from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Arrays, Equatable } from "purify-ts-helpers";
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

  async concept(identifier: Identifier): Promise<Maybe<Stub<ConceptT>>> {
    for (const conceptStub of await this.kos.concepts({
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

  concepts(kwds?: {
    limit?: number;
    offset?: number;
  }): Promise<StubSequence<ConceptT>> {
    return this.kos.concepts({
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

  equals(other: IConceptScheme<any, any>): Equatable.EqualsResult {
    return ConceptScheme.equals(this, other);
  }

  topConcepts(kwds?: {
    limit?: number;
    offset?: number;
  }): Promise<StubSequence<ConceptT>> {
    return this.kos.concepts({
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

  protected abstract override labelsByType(
    type: ILabel.Type,
  ): readonly ILabel[];
}

export namespace ConceptScheme {
  export function equals(
    left: IConceptScheme<any, any>,
    right: IConceptScheme<any, any>,
  ): Equatable.EqualsResult {
    return Equatable.objectEquals(left, right, {
      identifier: Equatable.booleanEquals,
      labels: (left, right) =>
        Arrays.equals(left(), right(), (left, right) => left.equals(right)),
    });
  }

  export type Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > = LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>;
}
