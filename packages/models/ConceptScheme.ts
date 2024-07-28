import { Maybe } from "purify-ts";
import { Concept } from "./Concept.js";
import { Stub } from "./Stub.js";
import { LabelsMixin } from "./LabelsMixin.js";
import { ProvenanceMixin } from "./ProvenanceMixin.js";
import { Identifier } from "./Identifier.js";
import { NamedModel } from "./NamedModel.js";

export interface ConceptScheme
  extends LabelsMixin,
    NamedModel,
    ProvenanceMixin {
  conceptByIdentifier(identifier: Identifier): Promise<Maybe<Stub<Concept>>>;
  concepts(): AsyncGenerator<Stub<Concept>>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Stub<Concept>[]>;
  equals(other: ConceptScheme): boolean;
  topConcepts(): AsyncGenerator<Stub<Concept>>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Stub<Concept>[]>;
}

export namespace ConceptScheme {
  export function equals(left: ConceptScheme, right: ConceptScheme): boolean {
    if (!left.identifier.equals(right.identifier)) {
      return false;
    }

    if (!LabelsMixin.equals(left, right)) {
      return false;
    }

    if (!ProvenanceMixin.equals(left, right)) {
      return false;
    }

    return true;
  }
}
