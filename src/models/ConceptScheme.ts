import { Concept } from "./Concept";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  topConcepts(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  topConceptsCount(): Promise<number>;
}
