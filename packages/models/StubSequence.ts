import { Either } from "purify-ts";
import { NamedModel } from "./NamedModel.js";
import { Stub } from "./Stub.js";

/**
 * An immutable sequence of stubs returned by methods such as Kos.concepts. Its use is preferred over Stub<ModelT>[]
 * in order to support batching implementations of resolve().
 */
export interface StubSequence<ModelT extends NamedModel>
  extends Iterable<Stub<ModelT>> {
  readonly length: number;

  at(index: number): Stub<ModelT> | undefined;
  equals(other: StubSequence<ModelT>): boolean;

  /**
   * Try to resolve the stubs in the sequence, only returning the successful (Right) resolutions.
   */
  flatResolve(): Promise<readonly ModelT[]>;

  /**
   * Try to resolve the stubs in the sequence.
   *
   * Returns the equivalent of Stub.resolve for each stub. See the documentation for that method.
   */
  resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]>;
}