import { BlankNode, NamedNode } from "@rdfjs/types";
import { Option } from "fp-ts/Option";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";

export interface Kos {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<Concept>>;
  concepts(): AsyncIterable<Concept>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  conceptsCount(): Promise<number>;

  conceptSchemeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<ConceptScheme>>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
  conceptSchemseByIdentifiers(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<ConceptScheme>>;
}
