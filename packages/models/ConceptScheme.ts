import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";
import { Maybe } from "purify-ts";

export interface ConceptScheme extends LabeledModel {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<Maybe<Concept>>;
  concepts(): AsyncIterable<Concept>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  topConcepts(): AsyncIterable<Concept>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
