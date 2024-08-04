import { Maybe } from "purify-ts";
import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Stub as IStub,
  Identifier,
} from "../index.js";
import { Kos } from "./Kos.js";
import { NamedModel } from "./NamedModel.js";

export abstract class Stub<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
    ModelT extends ConceptT | ConceptSchemeT,
  >
  extends NamedModel
  implements IStub<ModelT>
{
  protected readonly kos: Kos<ConceptT, ConceptSchemeT, LabelT>;

  protected constructor({
    kos,
    ...superParameters
  }: Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.kos = kos;
  }

  get displayLabel() {
    return Identifier.toString(this.identifier);
  }

  equals(other: IStub<ModelT>): boolean {
    return Stub.equals(this, other);
  }

  protected get logger() {
    return this.kos.logger;
  }

  abstract resolve(): Promise<Maybe<ModelT>>;

  async resolveOrStub() {
    const model = (await this.resolve()).extractNullable();
    if (model !== null) {
      return model;
    }
    this.logger.info(
      "%s did not resolve, returning the stub",
      Identifier.toString(this.identifier),
    );
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

  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
  > extends NamedModel.Parameters {
    kos: Kos<ConceptT, ConceptSchemeT, LabelT>;
  }
}
