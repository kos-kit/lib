import { Concept } from "./Concept";
import { Identifier } from "./Identifier";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  readonly identifier: Identifier;

  topConcepts(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  topConceptsCount(): Promise<number>;
}
