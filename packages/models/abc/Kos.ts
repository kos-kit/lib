import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
  Identifier,
  LanguageTagSet,
} from "@kos-kit/models";
import { Stub } from "./Stub.js";

export abstract class Kos<
  ConceptT extends IConcept<any, any, any>,
  ConceptSchemeT extends IConceptScheme<any, any>,
  LabelT extends ILabel,
> implements IKos<ConceptT, ConceptSchemeT>
{
  readonly includeLanguageTags: LanguageTagSet;

  protected constructor({ includeLanguageTags }: Kos.Parameters) {
    this.includeLanguageTags = includeLanguageTags;
  }

  abstract conceptByIdentifier(
    identifier: Identifier,
  ): Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>;

  abstract concepts(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptsQuery;
  }): AsyncGenerator<Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT>>;

  abstract conceptsCount(query?: ConceptsQuery): Promise<number>;

  abstract conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Stub<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT>;

  abstract conceptSchemes(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptSchemesQuery;
  }): AsyncGenerator<Stub<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT>>;

  abstract conceptSchemesCount(query?: ConceptSchemesQuery): Promise<number>;
}

export namespace Kos {
  export interface Parameters {
    includeLanguageTags: LanguageTagSet;
  }
}
