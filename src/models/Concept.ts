import { Literal } from "@rdfjs/types";
import { SemanticRelationProperty } from "./SemanticRelationProperty";
import { NoteProperty } from "./NoteProperty";
import { LanguageTag } from "./LanguageTag";
import { LabeledModel } from "./LabeledModel";
import { Identifier } from "./Identifier";
import { ConceptScheme } from "./ConceptScheme";

export interface Concept extends LabeledModel {
  readonly identifier: Identifier;

  inSchemes(): Promise<readonly ConceptScheme[]>;

  notations(): Promise<readonly Literal[]>;

  notes(
    languageTag: LanguageTag,
    property: NoteProperty,
  ): Promise<readonly Literal[]>;

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]>;
  semanticRelationsCount(property: SemanticRelationProperty): Promise<number>;

  topConceptOf(): Promise<readonly ConceptScheme[]>;
}
