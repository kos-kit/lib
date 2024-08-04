import { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { NoteProperty } from "./NoteProperty.js";
import { SemanticRelationProperty } from "./SemanticRelationProperty.js";
import { Stub } from "./Stub.js";

export interface Concept<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
> extends LabeledModel<LabelT> {
  readonly modified: Maybe<Literal>;
  readonly notations: readonly Literal[];

  equals(other: Concept<any, any, any>): boolean;
  inSchemes(): AsyncGenerator<Stub<ConceptSchemeT>>;
  notes(property: NoteProperty): readonly Literal[];
  semanticRelations(
    property: SemanticRelationProperty,
    options?: { includeInverse?: boolean },
  ): AsyncGenerator<Stub<ConceptT>>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;
  topConceptOf(): AsyncGenerator<Stub<ConceptSchemeT>>;
}
