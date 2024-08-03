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
import { Kos } from "./Kos.js";
import { LabeledModel } from "./LabeledModel.js";
import { NamedModel } from "./NamedModel.js";

export abstract class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel
  implements IConceptScheme
{
  abstract readonly license: Maybe<Literal | NamedNode>;
  abstract readonly modified: Maybe<Literal>;
  abstract readonly rights: Maybe<Literal>;
  abstract readonly rightsHolder: Maybe<Literal>;

  protected readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;

  constructor({
    kos,
    ...superParameters
  }: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.kos = kos;
  }

  async conceptByIdentifier(
    identifier: Identifier,
  ): Promise<Maybe<ConceptStub<ConceptT, ConceptSchemeT, LabelT>>> {
    for await (const conceptStub of this.kos.concepts({
      limit: 1,
      query: { identifier },
    })) {
      return Maybe.of(conceptStub);
    }
    return Maybe.empty();
  }

  async *concepts(): AsyncGenerator<
    ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this.kos.concepts({ query: { inScheme: this.identifier } });
  }

  conceptsCount(): Promise<number> {
    return this.kos.conceptsCount({ inScheme: this.identifier });
  }

  equals(other: IConceptScheme): boolean {
    return ConceptScheme.equals(this, other);
  }

  protected abstract override labelsByType(
    type: ILabel.Type,
  ): readonly ILabel[];

  async *topConcepts(): AsyncGenerator<
    ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this.kos.concepts({ query: { topConceptOf: this.identifier } });
  }

  topConceptsCount(): Promise<number> {
    return this.kos.conceptsCount({ topConceptOf: this.identifier });
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

  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends NamedModel.Parameters {
    readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
  }
}
