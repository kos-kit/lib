import { BlankNode, NamedNode } from "@rdfjs/types";
import { Option } from "fp-ts/Option";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";

export interface Kos {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<Concept>>;
  conceptSchemeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<ConceptScheme>>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
  concepts(): AsyncIterable<Concept>;
  conceptsByIdentifiers(
    identifiers: readonly (BlankNode | NamedNode)[],
  ): Promise<readonly Option<Concept>[]>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
