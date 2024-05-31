import { Literal } from "@rdfjs/types";
import { SemanticRelationProperty } from "../SemanticRelationProperty";
import { LanguageTag } from "../LanguageTag";
import { NoteProperty } from "../NoteProperty";
import { LabeledModel } from "./LabeledModel";
import { ConceptScheme } from "./ConceptScheme";
import { skos } from "../../vocabularies";
import { Concept as IConcept } from "../Concept";

export class Concept extends LabeledModel implements IConcept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.inScheme, (term) =>
          term.termType === "BlankNode" || term.termType === "NamedNode"
            ? new ConceptScheme({
                dataset: this.dataset,
                identifier: term,
              })
            : null,
        ),
      ]),
    );
  }

  notes(
    languageTag: LanguageTag,
    property: NoteProperty,
  ): Promise<readonly Literal[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(property.identifier, (term) =>
          term.termType === "Literal" && term.language === languageTag
            ? term
            : null,
        ),
      ]),
    );
  }

  notations(): Promise<readonly Literal[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.notation, (term) =>
          term.termType === "Literal" ? term : null,
        ),
      ]),
    );
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(property.identifier, (term) =>
          term.termType === "NamedNode"
            ? new Concept({ dataset: this.dataset, identifier: term })
            : null,
        ),
      ]),
    );
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return new Promise((resolve) =>
      resolve(
        this.countObjects(
          property.identifier,
          (term) => term.termType === "NamedNode",
        ),
      ),
    );
  }

  topConceptOf(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.topConceptOf, (term) =>
          term.termType === "BlankNode" || term.termType === "NamedNode"
            ? new ConceptScheme({
                dataset: this.dataset,
                identifier: term,
              })
            : null,
        ),
      ]),
    );
  }
}
