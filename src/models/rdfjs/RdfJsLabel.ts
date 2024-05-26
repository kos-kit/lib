import { DatasetCore, Literal } from "@rdfjs/types";
import { Label } from "../Label";
import { RdfJsModel } from "./RdfJsModel";
import { Identifier } from "../Identifier";

export class RdfJsLabel extends RdfJsModel implements Label {
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
