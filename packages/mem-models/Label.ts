import { Literal } from "@rdfjs/types";
import { Label as ILabel } from "@kos-kit/models";
import { Model } from "./Model";
import { Kos } from "./Kos";
import { Resource } from "@kos-kit/rdf-resource";

export class Label extends Model implements ILabel {
  readonly literalForm: Literal;

  constructor({
    kos,
    identifier,
    literalForm,
  }: {
    identifier: Resource.Identifier;
    kos: Kos;
    literalForm: Literal;
  }) {
    super({ identifier, kos });
    this.literalForm = literalForm;
  }
}
