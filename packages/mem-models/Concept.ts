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
import { Literal, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { matchLiteral } from "./matchLiteral.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { NamedModel } from "./NamedModel.js";
import { ModelFactory } from "./ModelFactory.js";
import { Labels } from "./Labels.js";
import { Provenance } from "./Provenance.js";
import { Maybe } from "purify-ts";

export class Concept<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends NamedModel {
  private readonly labels: Labels<LabelT>;
  protected readonly modelFactory: ModelFactory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;
  private readonly provenance: Provenance;

  constructor({
    modelFactory,
    ...namedModelParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(namedModelParameters);
    this.labels = new Labels({
      labelFactory: modelFactory,
      ...namedModelParameters,
    });
    this.modelFactory = modelFactory;
    this.provenance = new Provenance(namedModelParameters);
  }

  get altLabels(): readonly ILabel[] {
    return this.labels.altLabels;
  }

  get displayLabel(): string {
    return this.labels.displayLabel;
  }

  equals(other: IConcept): boolean {
    return IConcept.equals(this, other);
  }

  get hiddenLabels(): readonly ILabel[] {
    return this.labels.hiddenLabels;
  }

  async inSchemes(): Promise<
    readonly ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>[]
  > {
    return this._inSchemes({ topOnly: false });
  }

  get license(): Maybe<Literal | NamedNode> {
    return this.provenance.license;
  }

  get modified(): Maybe<Literal> {
    return this.provenance.modified;
  }

  get notations(): readonly Literal[] {
    return [
      ...this.resource
        .values(skos.notation)
        .flatMap((value) => value.toLiteral().toList()),
    ];
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

  get prefLabels(): readonly ILabel[] {
    return this.labels.prefLabels;
  }

  get rights(): Maybe<Literal> {
    return this.provenance.rights;
  }

  get rightsHolder(): Maybe<Literal> {
    return this.provenance.rightsHolder;
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
