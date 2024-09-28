import { Either } from "purify-ts";
import { Model } from "./Model.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";
import "iterator-helpers-polyfill";
import { Equatable } from "purify-ts-helpers";

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
    if (this.length === other.length) {
      return Equatable.EqualsResult.Equal;
    }
    return Equatable.EqualsResult.Unequal({
      leftLength: this.length,
      rightLength: this.length,
      type: "ArrayLength",
    });
  }

  async flatResolve(): Promise<readonly ModelT[]> {
    return [];
  }

  async resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]> {
    return [];
  }
}
