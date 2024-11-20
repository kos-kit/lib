import { Literal } from "@rdfjs/types";
import { Logger } from "pino";
import { Maybe } from "purify-ts";
import { Arrays, Equatable } from "purify-ts-helpers";
import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { Identifier } from "../Identifier.js";
import { Kos } from "../Kos.js";
import { Label as ILabel } from "../Label.js";
import { LiteralLabel } from "../LiteralLabel.js";
import { Note } from "../Note";
import { Resource as IResource } from "../Resource.js";
import { matchLiteral } from "./matchLiteral.js";

export abstract class Resource<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> implements IResource<LabelT>
{
  abstract readonly identifier: Identifier;
  kos: Kos<ConceptT, ConceptSchemeT, LabelT>; // Intentionally mutable
  abstract readonly modified: Maybe<Literal>;
  abstract readonly notations: readonly Literal[];
  protected readonly logger: Logger;

  constructor({
    kos,
    logger,
  }: Resource.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    this.kos = kos;
    this.logger = logger;
  }

  get displayLabel(): string {
    const prefLabels = this.labels({ types: [ILabel.Type.PREFERRED] });
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

  labels(options?: { types?: readonly ILabel.Type[] }): readonly (
    | LiteralLabel
    | LabelT
  )[] {
    return (options?.types ?? ILabel.Types).flatMap((type) =>
      this.labelsByType(type),
    );
  }

  abstract notes(options?: { types?: readonly Note.Type[] }): readonly Note[];

  protected abstract labelsByType(
    type: ILabel.Type,
  ): readonly (LiteralLabel | LabelT)[];
}

export namespace Resource {
  export function resourceEquals(
    this: IResource<any>,
    other: IResource<any>,
  ): Equatable.EqualsResult {
    return Equatable.objectEquals(this, other, {
      identifier: Equatable.booleanEquals,
      labels: (left, right) =>
        Arrays.equals(left(), right(), (left, right) => left.equals(right)),
      notations: (left, right) =>
        Arrays.equals(left, right, (left, right) => left.equals(right)),
    });
  }

  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > {
    kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
    logger: Logger;
  }
}
