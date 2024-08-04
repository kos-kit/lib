import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { Identifier } from "./Identifier.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";

export interface ConceptScheme<
  ConceptT extends Concept<any, any, LabelT>,
  LabelT extends Label,
> extends LabeledModel<LabelT> {
  readonly license: Maybe<Literal | NamedNode>;
  readonly modified: Maybe<Literal>;
  readonly rights: Maybe<Literal>;
  readonly rightsHolder: Maybe<Literal>;

  conceptByIdentifier(identifier: Identifier): Promise<Maybe<Stub<ConceptT>>>;

  concepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    Stub<ConceptT>
  >;
  conceptsCount(): Promise<number>;

  equals(other: ConceptScheme<any, any>): boolean;

  topConcepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    Stub<ConceptT>
  >;
  topConceptsCount(): Promise<number>;
}
