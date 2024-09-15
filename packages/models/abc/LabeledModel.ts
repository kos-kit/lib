import { Logger } from "pino";
import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { Identifier } from "../Identifier.js";
import { Kos } from "../Kos.js";
import { Label as ILabel } from "../Label.js";
import { LiteralLabel } from "../LiteralLabel.js";
import { matchLiteral } from "./matchLiteral.js";

export abstract class LabeledModel<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> {
  abstract readonly identifier: Identifier;
  kos: Kos<ConceptT, ConceptSchemeT, LabelT>; // Intentionally mutable
  protected readonly logger: Logger;

  constructor({
    kos,
    logger,
  }: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    this.kos = kos;
    this.logger = logger;
  }

  get displayLabel(): string {
    const prefLabels = this.labels({ type: ILabel.Type.PREFERRED });
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

  labels(options?: { type?: ILabel.Type }): readonly (LiteralLabel | LabelT)[] {
    if (options?.type) {
      return this.labelsByType(options?.type);
    }
    const labels: (LiteralLabel | LabelT)[] = [];
    for (const type_ of ILabel.Types) {
      labels.push(...this.labelsByType(type_));
    }
    return labels;
  }

  protected abstract labelsByType(
    type: ILabel.Type,
  ): readonly (LiteralLabel | LabelT)[];
}

export namespace LabeledModel {
  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > {
    kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
    logger: Logger;
  }
}
