import { Literal } from "@rdfjs/types";
import { Label as ILabel } from "@kos-kit/models";
import { Model } from "./Model";
import { Kos } from "./Kos";
import { Resource } from "@kos-kit/rdf-resource";

export class Label extends Model implements ILabel {
  readonly literalForm: Literal;

  constructor({
    kos,
    literalForm,
    resource,
  }: {
    kos: Kos;
    literalForm: Literal;
    resource: Resource;
  }) {
    super({ kos, resource });
    this.literalForm = literalForm;
  }
}
