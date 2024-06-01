import { DatasetCore, Literal } from "@rdfjs/types";
import { Label as ILabel } from "../Label";
import { Model } from "./Model";
import { Identifier } from "../Identifier";
import { LanguageTagSet } from "../LanguageTagSet";

export class Label extends Model implements ILabel {
  readonly literalForm: Literal;

  constructor({
    dataset,
    identifier,
    includeLanguageTags,
    literalForm,
  }: {
    dataset: DatasetCore;
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
    literalForm: Literal;
  }) {
    super({ dataset, identifier, includeLanguageTags });
    this.literalForm = literalForm;
  }
}
