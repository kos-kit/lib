import { Literal } from "@rdfjs/types";
import { NoteProperty } from "../NoteProperty";
import { LabeledModel } from "./LabeledModel";
import { ConceptScheme } from "./ConceptScheme";
import { skos } from "../../vocabularies";
import { Concept as IConcept } from "../Concept";
import { mapTermToLiteral } from "./mapTermToLiteral";
import { matchLiteral } from "./matchLiteral";
import { SemanticRelationProperty } from "@kos-kit/models";

export class Concept extends LabeledModel implements IConcept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.inScheme, (term) =>
          term.termType === "BlankNode" || term.termType === "NamedNode"
            ? new ConceptScheme({
                identifier: term,
                kos: this.kos,
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
                identifier: term,
                kos: this.kos,
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
                identifier: term,
                kos: this.kos,
              })
            : null,
        ),
      ]),
    );
  }
}
