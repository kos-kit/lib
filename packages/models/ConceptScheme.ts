import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";

export interface ConceptScheme extends LabeledModel {
  topConcepts(): AsyncGenerator<Concept>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
