import { Maybe } from "purify-ts";
import { NamedModel } from "./NamedModel.js";
import { Stub } from "./Stub.js";

export class StubArray<ModelT extends NamedModel>
  implements Iterable<Stub<ModelT>>
{
  constructor(private readonly delegate: readonly Stub<ModelT>[]) {}

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
