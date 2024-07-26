/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Identifier,
  Label as ILabel,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { matchLiteral } from "./matchLiteral.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { NamedModel } from "./NamedModel.js";
import { mix } from "ts-mixer";
import { ProvenanceMixin } from "./ProvenanceMixin.js";
import { LabelsMixin } from "./LabelsMixin.js";
import { ModelFactory } from "./ModelFactory.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Concept<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends IConcept {}

@mix(LabelsMixin, ProvenanceMixin)
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Concept<ConceptT, ConceptSchemeT, LabelT> extends NamedModel {
  protected readonly modelFactory: ModelFactory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;

  constructor({
    modelFactory,
    ...namedModelParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(namedModelParameters);
    this.modelFactory = modelFactory;
  }

  get notations(): readonly Literal[] {
    return [
      ...this.resource
        .values(skos.notation)
        .flatMap((value) => value.toLiteral().toList()),
    ];
  }

  equals(other: IConcept): boolean {
    return IConcept.equals(this, other);
  }

  async inSchemes(): Promise<
    readonly ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>[]
  > {
    return this._inSchemes({ topOnly: false });
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [
      ...this.resource.values(property.identifier).flatMap((value) =>
        value
          .toLiteral()
          .filter((literal) =>
            matchLiteral(literal, {
              includeLanguageTags: this.includeLanguageTags,
            }),
          )
          .toList(),
      ),
    ];
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly ConceptStub<ConceptT, ConceptSchemeT, LabelT>[]> {
    return [
      ...this.resource.values(property.identifier).flatMap((value) =>
        value
          .toIri()
          .map(
            (identifier) =>
              new ConceptStub({
                modelFactory: this.modelFactory,
                resource: new Resource({ dataset: this.dataset, identifier }),
              }),
          )
          .toList(),
      ),
    ];
  }

  async semanticRelationsCount(
    property: SemanticRelationProperty,
  ): Promise<number> {
    return this.resource
      .values(property.identifier)
      .reduce((count, value) => (value.isIdentifier() ? count + 1 : count), 0);
  }

  async topConceptOf(): Promise<
    readonly ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>[]
  > {
    return this._inSchemes({ topOnly: true });
  }

  private _inSchemes({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>[] {
    const conceptSchemeIdentifiers = new TermSet<Identifier>();

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
        new ConceptSchemeStub({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
    );
  }
}

export namespace Concept {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends NamedModel.Parameters {
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
  }
}
