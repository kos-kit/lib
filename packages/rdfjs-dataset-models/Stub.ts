import { Stub as IStub, Identifier, Model, abc } from "@kos-kit/models";
import { Either } from "purify-ts";
import { MutableResource, MutableResourceSet, Resource } from "rdfjs-resource";

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

export namespace Stub {
  export function toRdf<ModelT extends Model>(
    instance: IStub<ModelT>,
    {
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: MutableResource.MutateGraph;
      resourceSet: MutableResourceSet;
    },
  ): MutableResource<Identifier> {
    return resourceSet.mutableNamedResource({
      identifier: instance.identifier,
      mutateGraph,
    });
  }
}
