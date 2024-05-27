import { DatasetCore, Literal, Quad } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel";
import { Concept as RdfJsConcept } from "../rdfjs/Concept";
import { Concept as IConcept } from "../Concept";
import { ConceptScheme } from "./ConceptScheme";
import { NoteProperty } from "../NoteProperty";
import { SemanticRelationProperty } from "../SemanticRelationProperty";

export class Concept extends LabeledModel<RdfJsConcept> implements IConcept {
  protected createRdfJsModel(dataset: DatasetCore<Quad, Quad>): RdfJsConcept {
    return new RdfJsConcept({ dataset, identifier: this.identifier });
  }

  async inSchemes(): Promise<readonly ConceptScheme[]> {
    return (await (await this.getOrCreateRdfJsModel()).inSchemes()).map(
      (conceptScheme) =>
        new ConceptScheme({
          identifier: conceptScheme.identifier,
          sparqlClient: this.sparqlClient,
        }),
    );
  }

  async notations(): Promise<readonly Literal[]> {
    return (await this.getOrCreateRdfJsModel()).notations();
  }

  async notes(
    languageTag: string,
    property: NoteProperty,
  ): Promise<readonly Literal[]> {
    return (await this.getOrCreateRdfJsModel()).notes(languageTag, property);
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
