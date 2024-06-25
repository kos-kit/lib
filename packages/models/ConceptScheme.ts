import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";

export interface ConceptScheme extends LabeledModel {
  concepts(): AsyncGenerator<Concept>;
  conceptsCount(): Promise<number>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;

  topConcepts(): AsyncGenerator<Concept>;
  topConceptsCount(): Promise<number>;
  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
}
