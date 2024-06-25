import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";
import { Option } from "fp-ts/Option";

export interface ConceptScheme extends LabeledModel {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Option<Concept>>;
  concepts(): AsyncGenerator<Concept>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;

  topConcepts(): AsyncGenerator<Concept>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
