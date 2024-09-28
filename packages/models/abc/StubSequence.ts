import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Model } from "../Model.js";
import { Stub } from "../Stub";
import { StubSequence as IStubSequence } from "../StubSequence.js";

export abstract class StubSequence<ModelT extends Model>
  implements IStubSequence<ModelT>
{
  abstract readonly length: number;

  abstract [Symbol.iterator](): Iterator<Stub<ModelT>>;

  abstract at(index: number): Stub<ModelT> | undefined;

  equals(other: StubSequence<ModelT>): Equatable.EqualsResult {
    if (this.length !== other.length) {
      return Equatable.EqualsResult.Unequal({
        leftLength: this.length,
        rightLength: other.length,
        type: "ArrayLength",
      });
    }

    let thisStubI = 0;
    for (const thisStub of this) {
      if (
        !other[Symbol.iterator]().some((otherStub) =>
          thisStub.equals(otherStub),
        )
      ) {
        return Equatable.EqualsResult.Unequal({
          leftIndex: thisStubI,
          leftValue: thisStub,
          type: "ArrayElement",
        });
      }
      thisStubI++;
    }

    return Equatable.EqualsResult.Equal;
  }

  async flatResolve(): Promise<readonly ModelT[]> {
    return (await this.resolve()).flatMap((modelEither) =>
      modelEither.map((model) => [model]).orDefault([]),
    );
  }

  abstract resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]>;
}
