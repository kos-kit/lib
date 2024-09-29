import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { Concept } from "./Concept.js";
import { Identifier } from "./Identifier.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";

export interface ConceptScheme<
  ConceptT extends Concept<any, any, LabelT>,
  LabelT extends Label,
> extends Equatable<ConceptScheme<any, any>>,
    LabeledModel<LabelT> {
  readonly license: Maybe<Literal | NamedNode>;
  readonly modified: Maybe<Literal>;
  readonly rights: Maybe<Literal>;
  readonly rightsHolder: Maybe<Literal>;

  concept(identifier: Identifier): Promise<Maybe<Stub<ConceptT>>>;
  concepts(kwds?: {
    limit?: number;
    offset?: number;
  }): Promise<StubSequence<ConceptT>>;
  conceptsCount(): Promise<number>;
  topConcepts(kwds?: {
    limit?: number;
    offset?: number;
  }): Promise<StubSequence<ConceptT>>;
  topConceptsCount(): Promise<number>;
}
