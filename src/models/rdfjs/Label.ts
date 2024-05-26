import { DatasetCore, Literal } from "@rdfjs/types";
import { Label as ILabel } from "../Label";
import { Model } from "./Model";
import { Identifier } from "../Identifier";

export class Label extends Model implements ILabel {
  readonly literalForm: Literal;

  constructor({
    dataset,
    identifier,
    literalForm,
  }: {
    dataset: DatasetCore;
    identifier: Identifier;
    literalForm: Literal;
  }) {
    super({ dataset, identifier });
    this.literalForm = literalForm;
  }
}
