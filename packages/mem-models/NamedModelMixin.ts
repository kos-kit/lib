import { Identifier, LanguageTagSet, NamedModel } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class NamedModelMixin implements NamedModel {
  abstract readonly displayLabel: string;
  abstract readonly identifier: Identifier;
  protected abstract readonly includeLanguageTags: LanguageTagSet;
  protected abstract readonly resource: Resource<Identifier>;
}
