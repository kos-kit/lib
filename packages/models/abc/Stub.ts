import { Logger } from "pino";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Identifier } from "../Identifier.js";
import { Model } from "../Model.js";
import { Stub as IStub } from "../Stub.js";
import { StubSequence } from "../StubSequence.js";
import { UnbatchedStubSequence } from "../UnbatchedStubSequence.js";

export abstract class Stub<ModelT extends Model> implements IStub<ModelT> {
  abstract readonly identifier: Identifier;
  protected readonly logger: Logger;

  constructor({
    logger,
  }: {
    logger: Logger;
  }) {
    this.logger = logger;
  }

  cons(...tail: readonly IStub<ModelT>[]): StubSequence<ModelT> {
    return new UnbatchedStubSequence([this, ...tail]);
  }

  equals(other: IStub<ModelT>): Equatable.EqualsResult {
    return Stub.equals(this, other);
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Stub.hash(this, hasher);
  }

  abstract resolve(): Promise<Either<this, ModelT>>;
}

export namespace Stub {
  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
    ModelT extends Model,
  >(instance: IStub<ModelT>, _hasher: HasherT): HasherT {
    _hasher.update(Identifier.toString(instance.identifier));
    return _hasher;
  }

  export function equals<ModelT extends Model>(
    left: IStub<ModelT>,
    right: IStub<ModelT>,
  ): Equatable.EqualsResult {
    return Equatable.objectEquals(left, right, {
      identifier: Equatable.booleanEquals,
    });
  }

  export function toJson<ModelT extends Model>(
    stub: IStub<ModelT>,
  ): {
    readonly "@id": string;
  } {
    return {
      "@id": stub.identifier.value,
    };
  }
}
