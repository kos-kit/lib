import { Label as ILabel } from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { NamedModel } from "./NamedModel.js";
import { Provenance } from "./Provenance.js";
import { Maybe } from "purify-ts";

export class Label extends NamedModel implements ILabel {
  readonly literalForm: Literal;
  private readonly provenance: Provenance;

  constructor({ literalForm, ...namedModelParameters }: Label.Parameters) {
    super(namedModelParameters);
    this.literalForm = literalForm;
    this.provenance = new Provenance(namedModelParameters);
  }

  get displayLabel(): string {
    return this.literalForm.value;
  }

  equals(other: ILabel): boolean {
    return ILabel.equals(this, other);
  }

  get license(): Maybe<Literal | NamedNode> {
    return this.provenance.license;
  }

  get modified(): Maybe<Literal> {
    return this.provenance.modified;
  }

  get rights(): Maybe<Literal> {
    return this.provenance.rights;
  }

  get rightsHolder(): Maybe<Literal> {
    return this.provenance.rightsHolder;
  }
}

export namespace Label {
  export interface Parameters extends NamedModel.Parameters {
    literalForm: Literal;
  }
}
