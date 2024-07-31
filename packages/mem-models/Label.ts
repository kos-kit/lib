import { Label as ILabel } from "@kos-kit/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { NamedModel } from "./NamedModel.js";
import { Provenance } from "./Provenance.js";

export class Label extends NamedModel implements ILabel {
  private readonly provenance: Provenance;

  readonly literalForm: Literal;

  constructor({ literalForm, ...namedModelParameters }: Label.Parameters) {
    super(namedModelParameters);
    this.literalForm = literalForm;
    this.provenance = new Provenance(namedModelParameters);
  }

  get displayLabel(): string {
    return this.literalForm.value;
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

  equals(other: ILabel): boolean {
    return ILabel.equals(this, other);
  }
}

export namespace Label {
  export interface Parameters extends NamedModel.Parameters {
    literalForm: Literal;
  }
}
