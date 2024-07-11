import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Maybe } from "purify-ts";

export interface Kos {
  conceptByIdentifier(identifier: Concept.Identifier): Promise<Maybe<Concept>>;
  conceptSchemeByIdentifier(
    identifier: ConceptScheme.Identifier,
  ): Promise<Maybe<ConceptScheme>>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
  concepts(): AsyncIterable<Concept>;
  conceptsByIdentifiers(
    identifiers: readonly Concept.Identifier[],
  ): Promise<readonly Maybe<Concept>[]>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
