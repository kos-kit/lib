import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";

export interface Kos {
  conceptByIdentifier(identifier: BlankNode | NamedNode): Promise<Concept>;
  concepts(): AsyncGenerator<Concept>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  conceptsCount(): Promise<number>;

  conceptSchemeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<ConceptScheme>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
}
