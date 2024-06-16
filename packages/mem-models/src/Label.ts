import { Literal } from "@rdfjs/types";
import { Label as ILabel } from "../Label";
import { Model } from "./Model";
import { Identifier } from "../Identifier";
import { Kos } from "./Kos";

export class Label extends Model implements ILabel {
  readonly literalForm: Literal;

  constructor({
    identifier,
    kos,
    literalForm,
  }: {
    identifier: Identifier;
    kos: Kos;
    literalForm: Literal;
  }) {
    super({ identifier, kos });
    this.literalForm = literalForm;
  }
}
