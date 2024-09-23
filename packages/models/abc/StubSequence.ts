import { Either } from "purify-ts";
import { NamedModel } from "../NamedModel.js";
import { Stub } from "../Stub";
import { StubSequence as IStubSequence } from "../StubSequence.js";

export abstract class StubSequence<ModelT extends NamedModel>
  implements IStubSequence<ModelT>
{
  abstract readonly length: number;

  abstract [Symbol.iterator](): Iterator<Stub<ModelT>>;

  abstract at(index: number): Stub<ModelT> | undefined;

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
    return (await this.resolve()).flatMap((modelEither) =>
      modelEither.map((model) => [model]).orDefault([]),
    );
  }

  abstract resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]>;
}
