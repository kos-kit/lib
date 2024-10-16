import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { Note } from "./Note";
import { SemanticRelation } from "./SemanticRelation.js";
import { StubSequence } from "./StubSequence.js";

export interface Concept<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> extends Equatable<ConceptT>,
    LabeledModel<LabelT> {
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  inSchemes(): Promise<StubSequence<ConceptSchemeT>>;
  notes(options?: { types?: readonly Note.Type[] }): readonly Note[];
  semanticRelations(
    type: SemanticRelation.Type,
    options?: {
      includeInverse?: boolean;
    },
  ): Promise<StubSequence<ConceptT>>;
  topConceptOf(): Promise<StubSequence<ConceptSchemeT>>;
}
