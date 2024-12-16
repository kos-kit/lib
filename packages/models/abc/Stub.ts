import { Logger } from "pino";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Identifier } from "../Identifier.js";
import { Model } from "../Model.js";
import { Stub as IStub } from "../Stub.js";
import { StubSequence } from "../StubSequence.js";

export abstract class Stub<ModelT extends Model> implements IStub<ModelT> {
  equals = Stub.equals;
  hash = Stub.hash;
  abstract readonly identifier: Identifier;
  protected readonly logger: Logger;

  constructor({
    logger,
  }: {
    logger: Logger;
  }) {
    this.logger = logger;
  }

  abstract cons(...tail: readonly IStub<ModelT>[]): StubSequence<ModelT>;

  abstract resolve(): Promise<Either<this, ModelT>>;
}

export namespace Stub {
  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
    ModelT extends Model,
  >(this: IStub<ModelT>, _hasher: HasherT): HasherT {
    _hasher.update(Identifier.toString(this.identifier));
    return _hasher;
  }

  export function equals<ModelT extends Model>(
    this: IStub<ModelT>,
    other: IStub<ModelT>,
  ): Equatable.EqualsResult {
    return Equatable.objectEquals(this, other, {
      identifier: Equatable.booleanEquals,
    });
  }
}
