import { Maybe } from "purify-ts";
import { NamedModel } from "../NamedModel.js";
import { Stub } from "../Stub";
import { StubSequence as IStubSequence } from "../StubSequence.js";

export abstract class StubSequence<ModelT extends NamedModel>
  implements IStubSequence<ModelT>
{
  abstract readonly length: number;

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
    return (await this.resolve()).flatMap((modelMaybe) => modelMaybe.toList());
  }

  abstract [Symbol.iterator](): Iterator<Stub<ModelT>>;

  abstract resolve(): Promise<readonly Maybe<ModelT>[]>;

  async resolveOrStub(): Promise<readonly NamedModel[]> {
    const models: NamedModel[] = [];
    (await this.resolve()).forEach((model, modelI) => {
      const modelNullable = model.extractNullable();
      if (modelNullable !== null) {
        models.push(modelNullable);
      } else {
        models.push(this.at(modelI)!);
      }
    });
    return models;
  }
}
