import { Logger, pino } from "pino";
import { Concept as IConcept } from "../Concept.js";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme.js";
import { ConceptSchemesQuery } from "../ConceptSchemesQuery.js";
import { ConceptsQuery } from "../ConceptsQuery.js";
import { Identifier } from "../Identifier.js";
import { Kos as IKos } from "../Kos.js";
import { Label as ILabel } from "../Label.js";
import { LanguageTagSet } from "../LanguageTagSet.js";
import { Stub } from "../Stub.js";
import { StubSequence } from "../StubSequence.js";

export abstract class Kos<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> implements IKos<ConceptT, ConceptSchemeT, LabelT>
{
  readonly includeLanguageTags: LanguageTagSet;
  readonly logger: Logger;

  protected constructor({ includeLanguageTags, logger }: Kos.Parameters) {
    this.includeLanguageTags = includeLanguageTags;
    this.logger =
      logger ??
      pino({
        level: "silent",
      });
  }

  abstract concept(identifier: Identifier): Stub<ConceptT>;

  abstract conceptScheme(identifier: Identifier): Stub<ConceptSchemeT>;

  abstract conceptSchemes(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>>;

  abstract conceptSchemesCount(query: ConceptSchemesQuery): Promise<number>;

  abstract concepts(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>>;

  abstract conceptsCount(query: ConceptsQuery): Promise<number>;
}

export namespace Kos {
  export interface Parameters {
    includeLanguageTags: LanguageTagSet;
    logger?: Logger;
  }
}
