import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { EmptyStubSequence } from "./EmptyStubSequence.js";
import { Model } from "./Model.js";
import { Stub } from "./Stub.js";

/**
 * An immutable sequence of stubs returned by methods such as Kos.concepts. Its use is preferred over Stub<ModelT>[]
 * in order to support batching implementations of resolve().
 */
export interface StubSequence<ModelT extends Model>
  extends Equatable<StubSequence<ModelT>>,
    Iterable<Stub<ModelT>> {
  readonly length: number;

  at(index: number): Stub<ModelT> | undefined;

  /**
   * Try to resolve all the stubs in the sequence at once, only returning the successful (Right) resolutions.
   */
  flatResolve(): Promise<readonly ModelT[]>;

  /**
   * Try to resolve each stub individually, only returning the successful (Right) resolutions.
   */
  flatResolveEach(): AsyncIterable<ModelT>;

  /**
   * Try to resolve all the stubs in the sequence at once.
   *
   * Returns the equivalent of Stub.resolve for each stub. See the documentation for that method.
   */
  resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]>;

  /**
   * Resolve each stub individually.
   *
   * Returns the equivalent of Stub.resolve for each stub. See the documentation for that method.
   */
  resolveEach(): AsyncIterable<Either<Stub<ModelT>, ModelT>>;
}

export namespace StubSequence {
  export function fromStubs<ModelT extends Model>(
    stubs: readonly Stub<ModelT>[],
  ): StubSequence<ModelT> {
    if (stubs.length === 0) {
      return new EmptyStubSequence<ModelT>();
    }
    return stubs[0].cons(...stubs.slice(1));
  }
}
