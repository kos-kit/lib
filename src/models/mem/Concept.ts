import { Literal } from "@rdfjs/types";
import { SemanticRelationProperty } from "../SemanticRelationProperty";
import { NoteProperty } from "../NoteProperty";
import { LabeledModel } from "./LabeledModel";
import { ConceptScheme } from "./ConceptScheme";
import { skos } from "../../vocabularies";
import { Concept as IConcept } from "../Concept";
import { mapTermToLiteral } from "./mapTermToLiteral";
import { matchLiteral } from "./matchLiteral";

export class Concept extends LabeledModel implements IConcept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.inScheme, (term) =>
          term.termType === "BlankNode" || term.termType === "NamedNode"
            ? new ConceptScheme({
                dataset: this.dataset,
                identifier: term,
                includeLanguageTags: this.includeLanguageTags,
              })
            : null,
        ),
      ]),
    );
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [
      ...this.filterAndMapObjects(property.identifier, (term) => {
        const literal = mapTermToLiteral(term);
        if (
          literal !== null &&
          matchLiteral(literal, {
            includeLanguageTags: this.includeLanguageTags,
          })
        ) {
          return literal;
        }
        return null;
      }),
    ];
  }

  get notations(): readonly Literal[] {
    return [...this.filterAndMapObjects(skos.notation, mapTermToLiteral)];
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(property.identifier, (term) =>
          term.termType === "NamedNode"
            ? new Concept({
                dataset: this.dataset,
                identifier: term,
                includeLanguageTags: this.includeLanguageTags,
              })
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
                includeLanguageTags: this.includeLanguageTags,
              })
            : null,
        ),
      ]),
    );
  }
}
