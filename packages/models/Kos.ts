import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Option } from "fp-ts/Option";

export interface Kos {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<Concept>>;
  concepts(): AsyncGenerator<Concept>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  conceptsCount(): Promise<number>;

  conceptSchemeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<ConceptScheme>>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
}
