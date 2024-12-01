import { Identifier, Model, abc } from "@kos-kit/models";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";

export class Stub<ModelT extends Model> extends abc.Stub<ModelT> {
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Either<Error, ModelT>;
  private readonly resource: Resource<Identifier>;

  constructor({
    modelFactory,
    resource,
    ...superParameters
  }: {
    modelFactory: (resource: Resource<Identifier>) => Either<Error, ModelT>;
    resource: Resource<Identifier>;
  } & Omit<ConstructorParameters<typeof abc.Stub>[0], "identifier">) {
    super(superParameters);
    this.modelFactory = modelFactory;
    this.resource = resource;
  }

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  async resolve(): Promise<Either<this, ModelT>> {
    return this.modelFactory(this.resource).mapLeft((error) => {
      this.logger.warn(
        "%s is missing, unable to resolve: %s",
        Identifier.toString(this.identifier),
        error.message,
      );
      return this;
    });
  }
}
