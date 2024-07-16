import { Model as IModel, StubModel as IStubModel } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Maybe } from "purify-ts";

export abstract class StubModel<
  IdentifierT extends Resource.Identifier,
  ModelT extends IModel,
> implements IStubModel<ModelT>
{
  protected readonly resource: Resource<IdentifierT>;

  constructor({ resource }: StubModel.Parameters<IdentifierT>) {
    this.resource = resource;
  }

  get identifier(): IdentifierT {
    return this.resource.identifier;
  }

  abstract resolve(): Promise<Maybe<ModelT>>;
}

export namespace StubModel {
  export interface Parameters<IdentifierT extends Resource.Identifier> {
    resource: Resource<IdentifierT>;
  }
}
