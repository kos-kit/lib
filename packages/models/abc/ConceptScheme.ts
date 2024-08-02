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
import { NamedModel } from "./NamedModel.js";
import { matchLiteral } from "./matchLiteral.js";

export abstract class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends NamedModel
  implements IConceptScheme
{
  abstract readonly license: Maybe<Literal | NamedNode>;
  abstract readonly modified: Maybe<Literal>;
  abstract readonly rights: Maybe<Literal>;
  abstract readonly rightsHolder: Maybe<Literal>;

  private readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;

  constructor({
    kos,
    ...namedModelParameters
  }: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(namedModelParameters);
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

  get displayLabel(): string {
    const prefLabels = this.labels(ILabel.Type.PREFERRED);
    if (prefLabels.length > 0) {
      for (const prefLabel of prefLabels) {
        if (
          matchLiteral(prefLabel.literalForm, {
            includeLanguageTags: this.kos.includeLanguageTags,
          })
        ) {
          return prefLabel.literalForm.value;
        }
      }
    }

    return Identifier.toString(this.identifier);
  }

  equals(other: IConceptScheme): boolean {
    return ConceptScheme.equals(this, other);
  }

  abstract labels(type?: ILabel.Type): readonly ILabel[];

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
