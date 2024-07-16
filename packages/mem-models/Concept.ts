import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";
import { matchLiteral } from "./matchLiteral.js";
import { StubConceptScheme } from "./StubConceptScheme.js";
import { StubConcept } from "./StubConcept.js";

export class Concept<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel<ConceptT, ConceptSchemeT, LabelT>
  implements IConcept
{
  get notations(): readonly Literal[] {
    return [...this.resource.values(skos.notation)].flatMap((value) =>
      value.toLiteral().toList(),
    );
  }

  async inSchemes(): Promise<
    readonly StubConceptScheme<ConceptT, ConceptSchemeT, LabelT>[]
  > {
    return this._inSchemes({ topOnly: false });
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [...this.resource.values(property.identifier)].flatMap((value) =>
      value
        .toLiteral()
        .filter((literal) =>
          matchLiteral(literal, {
            includeLanguageTags: this.includeLanguageTags,
          }),
        )
        .toList(),
    );
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly StubConcept<ConceptT, ConceptSchemeT, LabelT>[]> {
    return [...this.resource.values(property.identifier)].flatMap((value) =>
      value
        .toIri()
        .map(
          (identifier) =>
            new StubConcept({
              modelFactory: this.modelFactory,
              resource: new Resource({ dataset: this.dataset, identifier }),
            }),
        )
        .toList(),
    );
  }

  async semanticRelationsCount(
    property: SemanticRelationProperty,
  ): Promise<number> {
    return [...this.resource.values(property.identifier)].reduce(
      (count, value) => (value.isIdentifier() ? count + 1 : count),
      0,
    );
  }

  async topConceptOf(): Promise<
    readonly StubConceptScheme<ConceptT, ConceptSchemeT, LabelT>[]
  > {
    return this._inSchemes({ topOnly: true });
  }

  private _inSchemes({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly StubConceptScheme<ConceptT, ConceptSchemeT, LabelT>[] {
    const conceptSchemeIdentifiers = new TermSet<IConceptScheme.Identifier>();

    for (const quad of this.resource.dataset.match(
      null,
      skos.hasTopConcept,
      this.identifier,
    )) {
      if (quad.subject.termType === "NamedNode") {
        conceptSchemeIdentifiers.add(quad.subject);
      }
    }

    for (const conceptSchemeIdentifier of this.resource.values(
      skos.topConceptOf,
    )) {
      conceptSchemeIdentifier
        .toIri()
        .ifJust((iri) => conceptSchemeIdentifiers.add(iri));
    }

    if (!topOnly) {
      for (const conceptSchemeIdentifier of this.resource.values(
        skos.inScheme,
      )) {
        conceptSchemeIdentifier
          .toIri()
          .ifJust((iri) => conceptSchemeIdentifiers.add(iri));
      }
    }

    return [...conceptSchemeIdentifiers].map(
      (identifier) =>
        new StubConceptScheme({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
    );
  }
}
