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
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";

export abstract class Kos<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> implements IKos
{
  readonly includeLanguageTags: LanguageTagSet;

  protected constructor({ includeLanguageTags }: Kos.Parameters) {
    this.includeLanguageTags = includeLanguageTags;
  }

  abstract conceptByIdentifier(
    identifier: Identifier,
  ): ConceptStub<ConceptT, ConceptSchemeT, LabelT>;

  abstract concepts(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptsQuery;
  }): AsyncGenerator<ConceptStub<ConceptT, ConceptSchemeT, LabelT>>;

  abstract conceptsCount(query?: ConceptsQuery): Promise<number>;

  abstract conceptSchemeByIdentifier(
    identifier: Identifier,
  ): ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>;

  abstract conceptSchemes(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptSchemesQuery;
  }): AsyncGenerator<ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>>;

  abstract conceptSchemesCount(query?: ConceptSchemesQuery): Promise<number>;
}

export namespace Kos {
  export interface Parameters {
    includeLanguageTags: LanguageTagSet;
  }
}
