import { Logger } from "pino";
import { Either } from "purify-ts";
import { Stub as IStub, Identifier, NamedModel } from "../index.js";

export abstract class Stub<ModelT extends NamedModel> implements IStub<ModelT> {
  abstract readonly identifier: Identifier;
  protected readonly logger: Logger;

  protected constructor({ logger }: Stub.Parameters) {
    this.logger = logger;
  }

  get displayLabel() {
    return Identifier.toString(this.identifier);
  }

  equals(other: IStub<ModelT>): boolean {
    return Stub.equals(this, other);
  }

  abstract resolve(): Promise<Either<this, ModelT>>;
}

export namespace Stub {
  export function equals<ModelT extends NamedModel>(
    left: IStub<ModelT>,
    right: IStub<ModelT>,
  ): boolean {
    return left.identifier.equals(right.identifier);
  }

  export interface Parameters {
    logger: Logger;
  }
}
