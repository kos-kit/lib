import { Either } from "purify-ts";
import { NamedModel } from "./NamedModel.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";
import "iterator-helpers-polyfill";

export class EmptyStubSequence<ModelT extends NamedModel>
  implements StubSequence<ModelT>
{
  readonly length = 0;

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return [][Symbol.iterator]();
  }

  at(_index: number): Stub<ModelT> | undefined {
    return undefined;
  }

  equals(other: StubSequence<ModelT>): boolean {
    return this.length === other.length;
  }

  async flatResolve(): Promise<readonly ModelT[]> {
    return [];
  }

  async resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]> {
    return [];
  }
}
