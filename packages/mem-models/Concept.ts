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
      value.literal.toList(),
    );
  }

  inSchemes(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: false }));
    });
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [...this.resource.values(property.identifier)].flatMap((value) =>
      value.literal
        .filter((literal) =>
          matchLiteral(literal, {
            includeLanguageTags: this.includeLanguageTags,
          }),
        )
        .toList(),
    );
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      resolve(
        [...this.resource.values(property.identifier)].flatMap((value) =>
          value.identifier
            .map((identifier) =>
              this.modelFactory.createConcept(
                new Resource({ dataset: this.dataset, identifier }),
              ),
            )
            .toList(),
        ),
      );
    });
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return new Promise((resolve) => {
      resolve(
        [...this.resource.values(property.identifier)].reduce(
          (count, value) => (value.isIdentifier ? count + 1 : count),
          0,
        ),
      );
    });
  }

  topConceptOf(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: true }));
    });
  }

  private _inSchemes({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly ConceptSchemeT[] {
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
      conceptSchemeIdentifier.iri.ifJust((iri) =>
        conceptSchemeIdentifiers.add(iri),
      );
    }

    if (!topOnly) {
      for (const conceptSchemeIdentifier of this.resource.values(
        skos.inScheme,
      )) {
        conceptSchemeIdentifier.iri.ifJust((iri) =>
          conceptSchemeIdentifiers.add(iri),
        );
      }
    }

    return [...conceptSchemeIdentifiers].map((identifier) =>
      this.modelFactory.createConceptScheme(
        new Resource({ dataset: this.dataset, identifier }),
      ),
    );
  }
}
