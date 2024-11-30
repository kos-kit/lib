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
import { UnbatchedStubSequence } from "../UnbatchedStubSequence.js";

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

  abstract conceptByIdentifier(identifier: Identifier): Stub<ConceptT>;

  abstract conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Stub<ConceptSchemeT>;

  conceptSchemes(kwds: { limit: number | null; offset: number }): Promise<
    StubSequence<ConceptSchemeT>
  > {
    return this.conceptSchemesByQuery({ ...kwds, query: { type: "All" } });
  }

  conceptSchemesByIdentifiers(
    identifiers: readonly Identifier[],
  ): StubSequence<ConceptSchemeT> {
    return new UnbatchedStubSequence(
      identifiers.map((identifier) =>
        this.conceptSchemeByIdentifier(identifier),
      ),
    );
  }

  abstract conceptSchemesByQuery(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>>;

  conceptSchemesCount(): Promise<number> {
    return this.conceptSchemesCountByQuery({ type: "All" });
  }

  abstract conceptSchemesCountByQuery(
    query: ConceptSchemesQuery,
  ): Promise<number>;

  concepts(kwds: { limit: number | null; offset: number }): Promise<
    StubSequence<ConceptT>
  > {
    return this.conceptsByQuery({ ...kwds, query: { type: "All" } });
  }

  conceptsByIdentifiers(
    identifiers: readonly Identifier[],
  ): StubSequence<ConceptT> {
    return new UnbatchedStubSequence(
      identifiers.map((identifier) => this.conceptByIdentifier(identifier)),
    );
  }

  abstract conceptsByQuery(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>>;

  conceptsCount(): Promise<number> {
    return this.conceptsCountByQuery({ type: "All" });
  }

  abstract conceptsCountByQuery(query: ConceptsQuery): Promise<number>;
}

export namespace Kos {
  export interface Parameters {
    includeLanguageTags: LanguageTagSet;
    logger?: Logger;
  }
}
