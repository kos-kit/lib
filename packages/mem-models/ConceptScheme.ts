import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { isRdfInstanceOf } from "@kos-kit/rdf-utils";
import TermSet from "@rdfjs/term-set";
import { Literal, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Just, Maybe, Nothing } from "purify-ts";
import { ConceptStub } from "./ConceptStub.js";
import { Labels } from "./Labels.js";
import { ModelFactory } from "./ModelFactory.js";
import { NamedModel } from "./NamedModel.js";
import { Provenance } from "./Provenance.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

export class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends NamedModel
  implements IConceptScheme
{
  private readonly labels: Labels<LabelT>;
  private readonly provenance: Provenance;

  protected readonly modelFactory: ModelFactory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;

  constructor({
    modelFactory,
    ...namedModelParameters
  }: ConceptScheme.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
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

  get hiddenLabels(): readonly ILabel[] {
    return this.labels.hiddenLabels;
  }

  get license(): Maybe<Literal | NamedNode> {
    return this.provenance.license;
  }

  get modified(): Maybe<Literal> {
    return this.provenance.modified;
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

  async *_concepts({
    topOnly,
  }: {
    topOnly: boolean;
  }): AsyncGenerator<ConceptStub<ConceptT, ConceptSchemeT, LabelT>> {
    for await (const identifier of this._conceptIdentifiers({ topOnly })) {
      yield new ConceptStub({
        modelFactory: this.modelFactory,
        resource: new Resource({ dataset: this.dataset, identifier }),
      });
    }
  }

  async _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return countIterable(this._conceptIdentifiers({ topOnly }));
  }

  async conceptByIdentifier(
    identifier: Identifier,
  ): Promise<Maybe<ConceptStub<ConceptT, ConceptSchemeT, LabelT>>> {
    // conceptScheme skos:hasTopConcept resource entails resource is a skos:Concept because of
    // the range of skos:hasTopConcept
    for (const _ of this.resource.dataset.match(
      this.identifier,
      skos.hasTopConcept,
      identifier,
    )) {
      return Just(
        new ConceptStub({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
      );
    }

    // resource skos:topConceptOf conceptScheme entails resource is a skos:Concept because of the
    // domain of skos:topConceptOf
    // resource skos:inScheme conceptScheme does not entail resource is a skos:Concept, since
    // skos:inScheme has an open domain
    for (const predicate of [skos.inScheme, skos.topConceptOf]) {
      for (const _ of this.resource.dataset.match(
        identifier,
        predicate,
        this.identifier,
      )) {
        if (
          predicate.equals(skos.topConceptOf) ||
          isRdfInstanceOf({
            class_: skos.Concept,
            dataset: this.dataset,
            instance: identifier,
          })
        ) {
          return Just(
            new ConceptStub({
              modelFactory: this.modelFactory,
              resource: new Resource({ dataset: this.dataset, identifier }),
            }),
          );
        }
      }
    }

    return Nothing;
  }

  async *concepts(): AsyncGenerator<
    ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this._concepts({ topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptStub<ConceptT, ConceptSchemeT, LabelT>[]> {
    return this._conceptsPage({ ...kwds, topOnly: false });
  }

  equals(other: IConceptScheme): boolean {
    return IConceptScheme.equals(this, other);
  }

  async *topConcepts(): AsyncGenerator<
    ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    yield* this._concepts({ topOnly: true });
  }

  topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }

  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptStub<ConceptT, ConceptSchemeT, LabelT>[]> {
    return this._conceptsPage({ ...kwds, topOnly: true });
  }

  private *_conceptIdentifiers({
    topOnly,
  }: {
    topOnly: boolean;
  }): Generator<Identifier> {
    const conceptIdentifierSet = new TermSet<Identifier>();

    // ConceptScheme -> Concept statement
    for (const conceptIdentifier of [
      ...this.resource.values(skos.hasTopConcept),
    ].flatMap((value) => value.toIri().toList())) {
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
        if (quad.subject.termType !== "NamedNode") {
          continue;
        }
        const conceptIdentifier = quad.subject;

        // See note in conceptByIdentifier about skos:inScheme
        if (
          predicate.equals(skos.inScheme) &&
          !isRdfInstanceOf({
            class_: skos.Concept,
            dataset: this.dataset,
            instance: conceptIdentifier,
          })
        ) {
          continue;
        }

        if (conceptIdentifierSet.has(conceptIdentifier)) {
          continue;
        }

        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
  }

  private async _conceptsPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly ConceptStub<ConceptT, ConceptSchemeT, LabelT>[]> {
    const result: ConceptStub<ConceptT, ConceptSchemeT, LabelT>[] = [];
    for (const identifier of paginateIterable(
      this._conceptIdentifiers({ topOnly }),
      {
        limit,
        offset,
      },
    )) {
      result.push(
        new ConceptStub({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
      );
    }
    return result;
  }
}

export namespace ConceptScheme {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends NamedModel.Parameters {
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
  }
}
