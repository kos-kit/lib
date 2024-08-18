import { Maybe } from "purify-ts";
import { NamedModel } from "./NamedModel.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";
import "iterator-helpers-polyfill";

/**
 * An inefficient implementation of StubSequence that takes an array of Stubs and resolves them individually.
 */
export class UnbatchedStubSequence<ModelT extends NamedModel>
  implements StubSequence<ModelT>
{
  constructor(private readonly delegate: readonly Stub<ModelT>[]) {}

  at(index: number): Stub<ModelT> | undefined {
    return this.delegate.at(index);
  }

  equals(other: StubSequence<ModelT>): boolean {
    if (this.length !== other.length) {
      return false;
    }

    for (const thisStub of this) {
      if (
        !other[Symbol.iterator]().some((otherStub) =>
          thisStub.equals(otherStub),
        )
      ) {
        return false;
      }
    }

    return true;
  }

  async flatResolve(): Promise<readonly ModelT[]> {
    return (await this.resolve()).flatMap((modelMaybe) => modelMaybe.toList());
  }

  get length() {
    return this.delegate.length;
  }

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return this.delegate[Symbol.iterator]();
  }

  async resolve(): Promise<readonly Maybe<ModelT>[]> {
    return await Promise.all(this.delegate.map((model) => model.resolve()));
  }

  async resolveOrStub(): Promise<readonly NamedModel[]> {
    const models: NamedModel[] = [];
    (await this.resolve()).forEach((model, modelI) => {
      const modelNullable = model.extractNullable();
      if (modelNullable !== null) {
        models.push(modelNullable);
      } else {
        models.push(this.delegate[modelI]);
      }
    });
    return models;
  }
}
