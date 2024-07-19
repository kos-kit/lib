import { Maybe } from "purify-ts";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";

export class StubArray<LabeledModelT extends LabeledModel>
  implements Iterable<Stub<LabeledModelT>>
{
  constructor(private readonly array: readonly Stub<LabeledModelT>[]) {}

  at(index: number): Stub<LabeledModelT> {
    return this.array[index];
  }

  async flatResolve(): Promise<readonly LabeledModelT[]> {
    const models: LabeledModelT[] = [];
    for (const model of await this.resolve()) {
      const modelNullable = model.extractNullable();
      if (modelNullable !== null) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        models.push(modelNullable! as LabeledModelT);
      }
    }
    return models;
  }

  static async fromAsyncIterable<LabeledModelT extends LabeledModel>(
    asyncIterable: AsyncIterable<Stub<LabeledModelT>>,
  ): Promise<StubArray<LabeledModelT>> {
    const array: Stub<LabeledModelT>[] = [];
    for await (const stub of asyncIterable) {
      array.push(stub);
    }
    return new StubArray(array);
  }

  async resolve(): Promise<readonly Maybe<LabeledModelT>[]> {
    return await Promise.all(this.array.map((model) => model.resolve()));
  }

  [Symbol.iterator](): Iterator<Stub<LabeledModelT>> {
    return this.array[Symbol.iterator]();
  }

  toArray(): readonly Stub<LabeledModelT>[] {
    return this.array;
  }
}
