import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { Concept } from "./Concept.js";
import { Label } from "./Label.js";
import { LabeledModel } from "./LabeledModel.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

export class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends Label,
  >
  extends LabeledModel<LabelT>
  implements IConceptScheme
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
  }: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(labeledModelParameters);
    this.conceptFactory = conceptFactory;
    this.conceptSchemeFactory = conceptSchemeFactory;
  }

  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<O.Option<ConceptT>> {
    return new Promise((resolve) => {
      for (const _ of this.resource.dataset.match(
        this.identifier,
        skos.hasTopConcept,
        identifier,
      )) {
        resolve(
          O.some(
            new this.conceptFactory({
              conceptFactory: this.conceptFactory,
              conceptSchemeFactory: this.conceptSchemeFactory,
              dataset: this.dataset,
              identifier,
              includeLanguageTags: this.includeLanguageTags,
              labelFactory: this.labelFactory,
            }),
          ),
        );
        return;
      }

      for (const predicate of [skos.inScheme, skos.topConceptOf]) {
        for (const _ of this.resource.dataset.match(
          identifier,
          predicate,
          this.identifier,
        )) {
          resolve(O.some(this.createConcept(identifier)));
          return;
        }
      }
    });
  }

  async *concepts(): AsyncIterable<ConceptT> {
    yield* this._concepts({ topOnly: false });
  }

  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return this._conceptsPage({ ...kwds, topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  private *_conceptIdentifiers({
    topOnly,
  }: {
    topOnly: boolean;
  }): Iterable<Resource.Identifier> {
    const conceptIdentifierSet = new TermSet<Resource.Identifier>();

    // ConceptScheme -> Concept statement
    for (const conceptIdentifier of this.resource.values(
      skos.hasTopConcept,
      Resource.ValueMappers.identifier,
    )) {
      if (!conceptIdentifierSet.has(conceptIdentifier)) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }

    // Concept -> ConceptScheme statement
    for (const predicate of topOnly
      ? [skos.topConceptOf]
      : [skos.inScheme, skos.topConceptOf])
      for (const quad of this.resource.dataset.match(
        null,
        predicate,
        this.identifier,
      )) {
        const conceptIdentifier = O.toNullable(
          Resource.ValueMappers.identifier(
            quad.subject as BlankNode | NamedNode,
          ),
        );
        if (
          conceptIdentifier !== null &&
          !conceptIdentifierSet.has(conceptIdentifier)
        ) {
          yield conceptIdentifier;
          conceptIdentifierSet.add(conceptIdentifier);
        }
      }
  }

  async *_concepts({ topOnly }: { topOnly: boolean }): AsyncIterable<ConceptT> {
    for await (const identifier of this._conceptIdentifiers({ topOnly })) {
      yield this.createConcept(identifier);
    }
  }

  _conceptsPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      const result: ConceptT[] = [];
      for (const identifier of paginateIterable(
        this._conceptIdentifiers({ topOnly }),
        {
          limit,
          offset,
        },
      )) {
        result.push(this.createConcept(identifier));
      }
      resolve(result);
    });
  }

  _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return new Promise((resolve) => {
      resolve(countIterable(this._conceptIdentifiers({ topOnly })));
    });
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

  async *topConcepts(): AsyncIterable<ConceptT> {
    yield* this._concepts({ topOnly: true });
  }

  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return this._conceptsPage({ ...kwds, topOnly: true });
  }

  topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }
}

export namespace ConceptScheme {
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
  ) => ConceptSchemeT;
}
