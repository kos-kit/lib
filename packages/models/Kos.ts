import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Maybe } from "purify-ts";

export interface Kos {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Maybe<Concept>>;
  conceptSchemeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Maybe<ConceptScheme>>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
  concepts(): AsyncIterable<Concept>;
  conceptsByIdentifiers(
    identifiers: readonly (BlankNode | NamedNode)[],
  ): Promise<readonly Maybe<Concept>[]>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
