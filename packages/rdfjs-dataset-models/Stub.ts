import { Identifier, NamedModel, abc } from "@kos-kit/models";
import { Either, Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";

export class Stub<ModelT extends NamedModel> extends abc.Stub<ModelT> {
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Maybe<ModelT>;
  private readonly resource: Resource<Identifier>;

  constructor({
    modelFactory,
    resource,
    ...superParameters
  }: {
    modelFactory: (resource: Resource<Identifier>) => Maybe<ModelT>;
    resource: Resource<Identifier>;
  } & Omit<abc.Stub.Parameters, "identifier">) {
    super(superParameters);
    this.modelFactory = modelFactory;
    this.resource = resource;
  }

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  async resolve(): Promise<Either<this, ModelT>> {
    return this.modelFactory(this.resource)
      .toEither(this)
      .ifLeft(() => {
        this.logger.warn(
          "%s is missing, unable to resolve",
          Identifier.toString(this.identifier),
        );
      });
  }
}
