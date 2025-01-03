import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Model } from "../Model.js";
import { Stub } from "../Stub.js";
import { StubSequence as IStubSequence } from "../StubSequence.js";

export abstract class StubSequence<ModelT extends Model>
  implements IStubSequence<ModelT>
{
  abstract readonly length: number;

  abstract [Symbol.iterator](): Iterator<Stub<ModelT>>;

  abstract at(index: number): Stub<ModelT> | undefined;

  equals(other: StubSequence<ModelT>): Equatable.EqualsResult {
    return Equatable.arrayEquals([...this], [...other]);
  }

  async flatResolve(): Promise<readonly ModelT[]> {
    return (await this.resolve()).flatMap((modelEither) =>
      modelEither.map((model) => [model]).orDefault([]),
    );
  }

  async *flatResolveEach(): AsyncIterable<ModelT> {
    for (const stub of this) {
      const model = await stub.resolve();
      if (model.isRight()) {
        yield model.unsafeCoerce();
      }
    }
  }

  abstract resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]>;

  async *resolveEach(): AsyncIterable<Either<Stub<ModelT>, ModelT>> {
    for (const stub of this) {
      yield await stub.resolve();
    }
  }
}
