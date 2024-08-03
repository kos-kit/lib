import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { Identifier } from "./Identifier.js";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";

export interface ConceptScheme extends LabeledModel {
  readonly license: Maybe<Literal | NamedNode>;
  readonly modified: Maybe<Literal>;
  readonly rights: Maybe<Literal>;
  readonly rightsHolder: Maybe<Literal>;

  conceptByIdentifier(identifier: Identifier): Promise<Maybe<Stub<Concept>>>;

  concepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    Stub<Concept>
  >;
  conceptsCount(): Promise<number>;

  equals(other: ConceptScheme): boolean;

  topConcepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    Stub<Concept>
  >;
  topConceptsCount(): Promise<number>;
}
