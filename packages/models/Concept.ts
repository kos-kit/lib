import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { StubSequence } from "./StubSequence.js";

export interface Concept<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> extends LabeledModel<LabelT> {
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  equals(other: Concept<any, any, any>): boolean;
  inSchemes(): Promise<StubSequence<ConceptSchemeT>>;
  notes(properties: readonly NoteProperty[]): readonly {
    readonly property: NoteProperty;
    readonly notes: readonly Literal[];
  }[];
  semanticRelations(
    properties: readonly SemanticRelationProperty[],
    options?: { includeInverse?: boolean },
  ): Promise<
    {
      readonly property: SemanticRelationProperty;
      readonly semanticRelations: StubSequence<ConceptT>;
    }[]
  >;
  topConceptOf(): Promise<StubSequence<ConceptSchemeT>>;
}
