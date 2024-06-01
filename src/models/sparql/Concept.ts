import { DatasetCore, Literal, Quad } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel";
import { Concept as RdfJsConcept } from "../mem/Concept";
import { Concept as IConcept } from "../Concept";
import { ConceptScheme } from "./ConceptScheme";
import { NoteProperty } from "../NoteProperty";
import { SemanticRelationProperty } from "../SemanticRelationProperty";

export class Concept extends LabeledModel<RdfJsConcept> implements IConcept {
  async inSchemes(): Promise<readonly ConceptScheme[]> {
    return (await (await this.getOrCreateRdfJsModel()).inSchemes()).map(
      (conceptScheme) =>
        new ConceptScheme({
          identifier: conceptScheme.identifier,
          sparqlClient: this.sparqlClient,
        }),
    );
  }

  get notations(): readonly Literal[] {
    return this.memModel.notations;
  }

  notes(property: NoteProperty): readonly Literal[] {
    return this.memModel.notes(property);
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return (
      await (await this.getOrCreateRdfJsModel()).semanticRelations(property)
    ).map(
      (conceptScheme) =>
        new Concept({
          identifier: conceptScheme.identifier,
          sparqlClient: this.sparqlClient,
        }),
    );
  }

  async semanticRelationsCount(
    property: SemanticRelationProperty,
  ): Promise<number> {
    return (await this.getOrCreateRdfJsModel()).semanticRelationsCount(
      property,
    );
  }

  async topConceptOf(): Promise<readonly ConceptScheme[]> {
    return (await (await this.getOrCreateRdfJsModel()).topConceptOf()).map(
      (conceptScheme) =>
        new ConceptScheme({
          identifier: conceptScheme.identifier,
          sparqlClient: this.sparqlClient,
        }),
    );
  }
}
