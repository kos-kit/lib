import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { matchLiteral } from "./matchLiteral.js";

export class Concept<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends Label,
  >
  extends LabeledModel<LabelT>
  implements IConcept
{
  private readonly conceptFactory: Concept.Factory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;

  private readonly conceptSchemeFactory: ConceptScheme.Factory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;

  constructor({
    conceptFactory,
    conceptSchemeFactory,
    ...labeledModelParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(labeledModelParameters);
    this.conceptFactory = conceptFactory;
    this.conceptSchemeFactory = conceptSchemeFactory;
  }

  protected createConcept(identifier: BlankNode | NamedNode): ConceptT {
    return new this.conceptFactory({
      conceptFactory: this.conceptFactory,
      conceptSchemeFactory: this.conceptSchemeFactory,
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      labelFactory: this.labelFactory,
    });
  }

  protected createConceptScheme(
    identifier: BlankNode | NamedNode,
  ): ConceptSchemeT {
    return new this.conceptSchemeFactory({
      conceptFactory: this.conceptFactory,
      conceptSchemeFactory: this.conceptSchemeFactory,
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      labelFactory: this.labelFactory,
    });
  }

  inSchemes(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: false }));
    });
  }

  private _inSchemes({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly ConceptSchemeT[] {
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
      this.createConceptScheme(identifier),
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
  ): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      resolve(
        [
          ...this.resource.values(
            property.identifier,
            Resource.ValueMappers.identifier,
          ),
        ].map((identifier) => this.createConcept(identifier)),
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

  topConceptOf(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: true }));
    });
  }
}

export namespace Concept {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends Label,
  > extends LabeledModel.Parameters<LabelT> {
    conceptFactory: Concept.Factory<ConceptT, ConceptSchemeT, LabelT>;

    conceptSchemeFactory: ConceptScheme.Factory<
      ConceptT,
      ConceptSchemeT,
      LabelT
    >;
  }

  export type Factory<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends Label,
  > = new (
    parameters: Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptT;
}
