import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";

export interface Kos {
  conceptByIri(identifier: BlankNode | NamedNode): Promise<Concept>;
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
