import {
  Concept as IConcept,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { ConceptScheme } from "./ConceptScheme.js";
import { LabeledModel } from "./LabeledModel.js";
import { matchLiteral } from "./matchLiteral.js";

export class Concept extends LabeledModel implements IConcept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: false }));
    });
  }

  private _inSchemes({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly ConceptScheme[] {
    const conceptSchemeIdentifiers = new TermSet<Resource.Identifier>();

    for (const quad of this.resource.dataset.match(
      null,
      skos.hasTopConcept,
      this.identifier,
    )) {
      switch (quad.subject.termType) {
        case "BlankNode":
        case "NamedNode":
          conceptSchemeIdentifiers.add(quad.subject);
          break;
      }
    }

    for (const conceptSchemeIdentifier of this.resource.values(
      skos.topConceptOf,
      Resource.ValueMappers.identifier,
    )) {
      conceptSchemeIdentifiers.add(conceptSchemeIdentifier);
    }

    if (!topOnly) {
      for (const conceptSchemeIdentifier of this.resource.values(
        skos.inScheme,
        Resource.ValueMappers.identifier,
      )) {
        conceptSchemeIdentifiers.add(conceptSchemeIdentifier);
      }
    }

    return [...conceptSchemeIdentifiers].map((identifier) =>
      this.kos.modelFactory.createConceptScheme({ identifier, kos: this.kos }),
    );
  }

  get notations(): readonly Literal[] {
    return [
      ...this.resource.values(skos.notation, Resource.ValueMappers.literal),
    ];
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [
      ...this.resource.values(property.identifier, (term) => {
        return pipe(
          Resource.ValueMappers.literal(term),
          O.filter((literal) =>
            matchLiteral(literal, {
              includeLanguageTags: this.includeLanguageTags,
            }),
          ),
        );
      }),
    ];
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      resolve(
        [
          ...this.resource.values(
            property.identifier,
            Resource.ValueMappers.identifier,
          ),
        ].map((identifier) =>
          this.kos.modelFactory.createConcept({ identifier, kos: this.kos }),
        ),
      );
    });
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return new Promise((resolve) => {
      resolve(
        this.resource.valuesCount(
          property.identifier,
          Resource.ValueMappers.identifier,
        ),
      );
    });
  }

  topConceptOf(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: true }));
    });
  }
}
