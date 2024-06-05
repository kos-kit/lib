import { Concept } from "./Concept";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  topConcepts(): AsyncGenerator<Concept>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
