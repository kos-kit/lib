import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { Identifier } from "../Identifier.js";
import { Label as ILabel } from "../Label.js";
import { Kos } from "./Kos.js";
import { NamedModel } from "./NamedModel.js";
import { matchLiteral } from "./matchLiteral.js";

export abstract class LabeledModel<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends NamedModel {
  protected readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;

  constructor({
    kos,
    ...superParameters
  }: LabeledModel.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.kos = kos;
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

  labels(type?: ILabel.Type): readonly ILabel[] {
    if (type) {
      return this.labelsByType(type);
    }
    const labels: ILabel[] = [];
    for (const type_ of ILabel.Types) {
      labels.push(...this.labelsByType(type_));
    }
    return labels;
  }

  protected abstract labelsByType(type: ILabel.Type): readonly ILabel[];
}

export namespace LabeledModel {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends NamedModel.Parameters {
    kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
  }
}
