import { Either } from "purify-ts";
import { Model } from "./Model.js";
import { Stub } from "./Stub.js";
import { StubSequence as AbcStubSequence } from "./abc/StubSequence.js";

export class EmptyStubSequence<
  ModelT extends Model,
> extends AbcStubSequence<ModelT> {
  readonly length = 0;

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return [][Symbol.iterator]();
  }

  at(_index: number): Stub<ModelT> | undefined {
    return undefined;
  }

  async resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]> {
    return [];
  }
}
