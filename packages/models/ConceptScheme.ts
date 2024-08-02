import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { Identifier } from "./Identifier.js";
import { Label } from "./Label.js";
import { NamedModel } from "./NamedModel.js";
import { Stub } from "./Stub.js";

export interface ConceptScheme extends NamedModel {
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

  labels(type?: Label.Type): readonly Label[];

  topConcepts(kwds?: { limit?: number; offset?: number }): AsyncGenerator<
    Stub<Concept>
  >;
  topConceptsCount(): Promise<number>;
}
