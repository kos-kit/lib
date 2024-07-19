import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";
import { StubArray } from "./StubArray.js";

export interface ConceptScheme extends LabeledModel {
  conceptByIdentifier(
    identifier: Concept.Identifier,
  ): Promise<Maybe<Stub<Concept>>>;
  concepts(): AsyncGenerator<Stub<Concept>>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<StubArray<Concept>>;
  topConcepts(): AsyncGenerator<Stub<Concept>>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<StubArray<Concept>>;
}

export namespace ConceptScheme {
  export type Identifier = LabeledModel.Identifier;

  export namespace Identifier {
    export const fromString = LabeledModel.Identifier.fromString;
    export const toString = LabeledModel.Identifier.toString;
  }
}
