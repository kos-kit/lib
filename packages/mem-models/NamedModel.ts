import {
  Identifier,
  NamedModel as INamedModel,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore } from "@rdfjs/types";

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class NamedModel implements INamedModel {
  abstract readonly displayLabel: string;
  protected readonly includeLanguageTags: LanguageTagSet;
  protected readonly resource: Resource<Identifier>;

  constructor({ includeLanguageTags, resource }: NamedModel.Parameters) {
    this.resource = resource;
    this.includeLanguageTags = includeLanguageTags;
  }

  get identifier(): Identifier {
    return this.resource.identifier;
  }

  protected get dataset(): DatasetCore {
    return this.resource.dataset;
  }
}

export namespace NamedModel {
  export interface Parameters {
    includeLanguageTags: LanguageTagSet;
    resource: Resource<Identifier>;
  }
}
