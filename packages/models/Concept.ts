import { Equatable } from "purify-ts-helpers";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { Resource } from "./Resource.js";
import { SemanticRelation } from "./SemanticRelation.js";
import { StubSequence } from "./StubSequence.js";

export interface Concept<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> extends Equatable<ConceptT>,
    Resource<LabelT> {
  inSchemes(): Promise<StubSequence<ConceptSchemeT>>;
  semanticRelations(
    type: SemanticRelation.Type,
    options?: {
      includeInverse?: boolean;
    },
  ): Promise<StubSequence<ConceptT>>;
  topConceptOf(): Promise<StubSequence<ConceptSchemeT>>;
}
