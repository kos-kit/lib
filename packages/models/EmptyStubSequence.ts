import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Model } from "./Model.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";

export class EmptyStubSequence<ModelT extends Model>
  implements StubSequence<ModelT>
{
  readonly length = 0;

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return [][Symbol.iterator]();
  }

  at(_index: number): Stub<ModelT> | undefined {
    return undefined;
  }

  equals(other: StubSequence<ModelT>): Equatable.EqualsResult {
    return Equatable.arrayEquals([], [...other]);
  }

  async flatResolve(): Promise<readonly ModelT[]> {
    return [];
  }

  async resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]> {
    return [];
  }
}
