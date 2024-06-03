import { Concept } from "./Concept";
import { LabeledModel } from "./LabeledModel";

export interface ConceptScheme extends LabeledModel {
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
