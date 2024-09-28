import { Logger } from "pino";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Stub as IStub, Identifier, Model } from "../index.js";

export abstract class Stub<ModelT extends Model> implements IStub<ModelT> {
  abstract readonly identifier: Identifier;
  protected readonly logger: Logger;

  protected constructor({ logger }: Stub.Parameters) {
    this.logger = logger;
  }

  equals(other: IStub<ModelT>): Equatable.EqualsResult {
    return Stub.equals(this, other);
  }

  abstract resolve(): Promise<Either<this, ModelT>>;
}

export namespace Stub {
  export function equals<ModelT extends Model>(
    left: IStub<ModelT>,
    right: IStub<ModelT>,
  ): Equatable.EqualsResult {
    return Equatable.propertyEquals(left, right, "identifier");
  }

  export interface Parameters {
    logger: Logger;
  }
}
