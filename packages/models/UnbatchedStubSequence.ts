import { Either } from "purify-ts";
import { Model } from "./Model.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./abc/StubSequence.js";
import "iterator-helpers-polyfill";

/**
 * An inefficient implementation of StubSequence that takes an array of Stubs and resolves them individually.
 */
export class UnbatchedStubSequence<
  ModelT extends Model,
> extends StubSequence<ModelT> {
  constructor(private readonly delegate: readonly Stub<ModelT>[]) {
    super();
  }

  get length() {
    return this.delegate.length;
  }

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return this.delegate[Symbol.iterator]();
  }

  at(index: number): Stub<ModelT> | undefined {
    return this.delegate.at(index);
  }

  async resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]> {
    return await Promise.all(this.delegate.map((stub) => stub.resolve()));
  }
}
