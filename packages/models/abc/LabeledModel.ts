import { Identifier } from "../Identifier.js";
import { Label as ILabel } from "../Label.js";
import { LanguageTagSet } from "../LanguageTagSet.js";
import { NamedModel } from "./NamedModel.js";
import { matchLiteral } from "./matchLiteral.js";

export abstract class LabeledModel extends NamedModel {
  protected abstract readonly includeLanguageTags: LanguageTagSet;

  get displayLabel(): string {
    const prefLabels = this.labels(ILabel.Type.PREFERRED);
    if (prefLabels.length > 0) {
      for (const prefLabel of prefLabels) {
        if (
          matchLiteral(prefLabel.literalForm, {
            includeLanguageTags: this.includeLanguageTags,
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
    return this.labelsByType(ILabel.Type.PREFERRED)
      .concat(this.labelsByType(ILabel.Type.ALTERNATIVE))
      .concat(this.labelsByType(ILabel.Type.HIDDEN))
      .concat(this.labelsByType(ILabel.Type.OTHER));
  }

  protected abstract labelsByType(type: ILabel.Type): readonly ILabel[];
}

export namespace LabeledModel {
  export type Parameters = NamedModel.Parameters;
}
