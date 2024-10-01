import { Logger } from "pino";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Stub as IStub, Identifier, Model } from "../index.js";

export abstract class Stub<ModelT extends Model> implements IStub<ModelT> {
  equals = Stub.equals;
  abstract readonly identifier: Identifier;
  protected readonly logger: Logger;

  protected constructor({ logger }: Stub.Parameters) {
    this.logger = logger;
  }

  abstract resolve(): Promise<Either<this, ModelT>>;
}

export namespace Stub {
  export function equals<ModelT extends Model>(
    this: IStub<ModelT>,
    other: IStub<ModelT>,
  ): Equatable.EqualsResult {
    return Equatable.objectEquals(this, other, {
      identifier: Equatable.booleanEquals,
    });
  }

  export interface Parameters {
    logger: Logger;
  }
}
