import {
  Identifier,
  Model,
  StubSequence,
  UnbatchedStubSequence,
  abc,
} from "@kos-kit/models";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";

export class Stub<ModelT extends Model> extends abc.Stub<ModelT> {
  private readonly modelFromRdf: (
    resource: Resource<Identifier>,
  ) => Either<Error, ModelT>;
  private readonly resource: Resource<Identifier>;

  constructor({
    modelFromRdf,
    resource,
    ...superParameters
  }: {
    modelFromRdf: (resource: Resource<Identifier>) => Either<Error, ModelT>;
    resource: Resource<Identifier>;
  } & Omit<ConstructorParameters<typeof abc.Stub>[0], "identifier">) {
    super(superParameters);
    this.modelFromRdf = modelFromRdf;
    this.resource = resource;
  }

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  override cons(...tail: readonly Stub<ModelT>[]): StubSequence<ModelT> {
    return new UnbatchedStubSequence([this, ...tail]);
  }

  async resolve(): Promise<Either<this, ModelT>> {
    return this.modelFromRdf(this.resource).mapLeft((error) => {
      this.logger.warn(
        "%s is missing, unable to resolve: %s",
        Identifier.toString(this.identifier),
        error.message,
      );
      return this;
    });
  }
}
