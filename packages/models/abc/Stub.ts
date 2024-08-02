import { Maybe } from "purify-ts";
import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  NamedModel as INamedModel,
  Stub as IStub,
  Identifier,
  NamedModel,
} from "..";
import { Kos } from "./Kos.js";

export abstract class Stub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
  ModelT extends INamedModel,
> implements IStub<ModelT>
{
  readonly identifier: Identifier;
  protected readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;

  constructor({
    identifier,
    kos,
  }: {
    identifier: Identifier;
    kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
  }) {
    this.identifier = identifier;
    this.kos = kos;
  }

  get displayLabel() {
    return Identifier.toString(this.identifier);
  }

  equals(other: IStub<ModelT>): boolean {
    return Stub.equals(this, other);
  }

  abstract resolve(): Promise<Maybe<ModelT>>;

  async resolveOrStub() {
    const model = (await this.resolve()).extractNullable();
    if (model !== null) {
      return model;
    }
    return this;
  }
}

export namespace Stub {
  export function equals<ModelT extends NamedModel>(
    left: IStub<ModelT>,
    right: IStub<ModelT>,
  ): boolean {
    return left.identifier.equals(right.identifier);
  }
}
