import { Maybe } from "purify-ts";
import { NamedModel } from "./NamedModel.js";
import { Stub } from "./Stub.js";

export namespace Stubs {
  export namespace Array {
    /**
     * Resolve each stub and remove missing models.
     */
    export async function flatResolve<ModelT extends NamedModel>(
      stubs: readonly Stub<ModelT>[],
    ): Promise<readonly ModelT[]> {
      const models: ModelT[] = [];
      for (const model of await Stubs.Array.resolve(stubs)) {
        const modelNullable = model.extractNullable();
        if (modelNullable !== null) {
          models.push(modelNullable! as ModelT);
        }
      }
      return models;
    }

    /**
     * Resolve each stub into an array of Maybe<ModelT>.
     */
    export async function resolve<ModelT extends NamedModel>(
      stubs: readonly Stub<ModelT>[],
    ): Promise<readonly Maybe<ModelT>[]> {
      return await Promise.all(stubs.map((model) => model.resolve()));
    }

    /**
     * Resolve each stub into an array of Models. If a model is present, add that model to the array. If a model is absent, add the stub.
     */
    export async function resolveOrStub<ModelT extends NamedModel>(
      stubs: readonly Stub<ModelT>[],
    ): Promise<readonly NamedModel[]> {
      const models: NamedModel[] = [];
      (await Stubs.Array.resolve(stubs)).forEach((model, modelI) => {
        const modelNullable = model.extractNullable();
        if (modelNullable !== null) {
          models.push(modelNullable);
        } else {
          models.push(stubs[modelI]);
        }
      });
      return models;
    }
  }

  export namespace AsyncIterable {
    /**
     * Iterate over stubs, resolving each, returning present models and skipping missing ones.
     */
    export async function* flatResolve<ModelT extends NamedModel>(
      stubs: AsyncIterable<Stub<ModelT>>,
    ): AsyncGenerator<ModelT> {
      const models: ModelT[] = [];
      for await (const model of Stubs.AsyncIterable.resolve(stubs)) {
        const modelNullable = model.extractNullable();
        if (modelNullable !== null) {
          yield modelNullable! as ModelT;
        }
      }
      return models;
    }

    /**
     * Iterate over stubs, resolving each.
     */
    export async function* resolve<ModelT extends NamedModel>(
      stubs: AsyncIterable<Stub<ModelT>>,
    ): AsyncGenerator<Maybe<ModelT>> {
      for await (const stub of stubs) {
        yield stub.resolve();
      }
    }
  }
}
