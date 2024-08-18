import { Maybe } from "purify-ts";
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
  flatResolve(): Promise<readonly ModelT[]>;
  resolve(): Promise<readonly Maybe<ModelT>[]>;
  resolveOrStub(): Promise<readonly NamedModel[]>;
}
