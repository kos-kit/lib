import { Logger } from "pino";
import { Maybe } from "purify-ts";
import {
  NamedModel as INamedModel,
  Stub as IStub,
  Identifier,
} from "../index.js";
import { NamedModel } from "./NamedModel.js";

export abstract class Stub<ModelT extends INamedModel>
  extends NamedModel
  implements IStub<ModelT>
{
  protected readonly logger: Logger;

  protected constructor({ logger, ...superParameters }: Stub.Parameters) {
    super(superParameters);
    this.logger = logger;
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

  export interface Parameters extends NamedModel.Parameters {
    logger: Logger;
  }
}
