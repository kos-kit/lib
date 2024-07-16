import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";
import { StubConcept } from "./StubConcept.js";

export interface ConceptScheme extends LabeledModel {
  conceptByIdentifier(
    identifier: Concept.Identifier,
  ): Promise<Maybe<StubConcept>>;
  concepts(): AsyncIterable<StubConcept>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept[]>;
  topConcepts(): AsyncIterable<StubConcept>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept[]>;
}

export namespace ConceptScheme {
  export type Identifier = LabeledModel.Identifier;

  export namespace Identifier {
    export const fromString = LabeledModel.fromString;
    export const toString = LabeledModel.toString;
  }
}
