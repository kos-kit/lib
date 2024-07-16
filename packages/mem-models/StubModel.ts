import {
  Model as IModel,
  StubModel as IStubModel,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Maybe } from "purify-ts";
import { Model } from "./Model.js";

export abstract class StubModel<
  IdentifierT extends Resource.Identifier,
  ModelT extends IModel,
> implements IStubModel<ModelT>
{
  protected readonly includeLanguageTags: LanguageTagSet;
  protected readonly resource: Resource<IdentifierT>;

  constructor({
    includeLanguageTags,
    resource,
  }: Model.Parameters<IdentifierT>) {
    this.resource = resource;
    this.includeLanguageTags = includeLanguageTags;
  }

  get identifier(): IdentifierT {
    return this.resource.identifier;
  }

  abstract resolve(): Promise<Maybe<ModelT>>;
}
