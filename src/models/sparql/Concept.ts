import { LabeledModel } from "./LabeledModel";
import { Concept as MemConcept } from "../mem/Concept";
import { Concept as IConcept } from "../Concept";
import { ConceptScheme } from "./ConceptScheme";
import { NoteProperty } from "../NoteProperty";
import { SemanticRelationProperty } from "../SemanticRelationProperty";
import { Literal } from "@rdfjs/types";

export class Concept extends LabeledModel<MemConcept> implements IConcept {
  // static IDENTIFIER_GRAPH_PATTERNS = [
  //   "?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> ";
  // ]

  // static OPTIONAL_GRAPH_PATTERNS = LabeledModel.OPTIONAL_GRAPH_PATTERNS;

  async inSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("not implemented yet");
    //   return (await (await this.getOrCreateRdfJsModel()).inSchemes()).map(
    //     (conceptScheme) =>
    //       new ConceptScheme({
    //         identifier: conceptScheme.identifier,
    //         sparqlClient: this.sparqlClient,
    //       }),
    //   );
  }

  get notations(): readonly Literal[] {
    return this.memModel.notations;
  }

  notes(property: NoteProperty): readonly Literal[] {
    return this.memModel.notes(property);
  }

  async semanticRelations(
    _property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    throw new Error("not implemented yet");
    // return (
    //   await (await this.getOrCreateRdfJsModel()).semanticRelations(property)
    // ).map(
    //   (conceptScheme) =>
    //     new Concept({
    //       identifier: conceptScheme.identifier,
    //       sparqlClient: this.sparqlClient,
    //     }),
    // );
  }

  async semanticRelationsCount(
    _property: SemanticRelationProperty,
  ): Promise<number> {
    throw new Error("not implemented yet");
    // return (await this.getOrCreateRdfJsModel()).semanticRelationsCount(
    //   property,
    // );
  }

  async topConceptOf(): Promise<readonly ConceptScheme[]> {
    throw new Error("not implemented yet");
    // return (await (await this.getOrCreateRdfJsModel()).topConceptOf()).map(
    //   (conceptScheme) =>
    //     new ConceptScheme({
    //       identifier: conceptScheme.identifier,
    //       sparqlClient: this.sparqlClient,
    //     }),
    // );
  }
}
