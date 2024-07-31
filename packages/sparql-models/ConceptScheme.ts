import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Identifier,
  Label,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal, NamedNode } from "@rdfjs/types";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import { Just, Maybe } from "purify-ts";
import { ConceptStub } from "./ConceptStub.js";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";

/**
 * See note in Concept re: the design of this class.
 */
export class ConceptScheme<
  MemConceptSchemeT extends IConceptScheme,
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> implements IConceptScheme
{
  protected readonly memModel: MemConceptSchemeT;
  protected readonly modelFetcher: ModelFetcher<
    SparqlConceptT,
    SparqlConceptSchemeT
  >;
  protected readonly sparqlClient: SparqlClient;

  constructor({
    memModel,
    modelFetcher,
    sparqlClient,
  }: ConceptScheme.Parameters<
    MemConceptSchemeT,
    SparqlConceptT,
    SparqlConceptSchemeT
  >) {
    this.memModel = memModel;
    this.modelFetcher = modelFetcher;
    this.sparqlClient = sparqlClient;
  }

  get altLabels(): readonly Label[] {
    return this.memModel.altLabels;
  }

  get displayLabel(): string {
    return this.memModel.displayLabel;
  }

  get hiddenLabels(): readonly Label[] {
    return this.memModel.hiddenLabels;
  }

  get identifier(): Identifier {
    return this.memModel.identifier;
  }

  get license(): Maybe<Literal | NamedNode> {
    return this.memModel.license;
  }

  get modified(): Maybe<Literal> {
    return this.memModel.modified;
  }

  get prefLabels(): readonly Label[] {
    return this.memModel.prefLabels;
  }

  get rights(): Maybe<Literal> {
    return this.memModel.rights;
  }

  get rightsHolder(): Maybe<Literal> {
    return this.memModel.rightsHolder;
  }

  async *_concepts({
    topOnly,
  }: {
    topOnly: boolean;
  }): AsyncGenerator<ConceptStub<SparqlConceptT, SparqlConceptSchemeT>> {
    const count = await this._conceptsCount({ topOnly });
    let offset = 0;
    while (offset < count) {
      for (const value of await this._conceptsPage({
        limit: 100,
        offset,
        topOnly,
      })) {
        yield value;
        offset++;
      }
    }
  }

  async _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
  ${this.conceptGraphPatterns({ topOnly }).join(" UNION ")}
}`),
      "count",
    );
  }

  async _conceptsPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly ConceptStub<SparqlConceptT, SparqlConceptSchemeT>[]> {
    return (await this._conceptIdentifiersPage({ limit, offset, topOnly })).map(
      (identifier) =>
        new ConceptStub({
          identifier,
          modelFetcher: this.modelFetcher,
        }),
    );
  }

  async conceptByIdentifier(
    identifier: Identifier,
  ): Promise<Maybe<ConceptStub<SparqlConceptT, SparqlConceptSchemeT>>> {
    // TODO: verify it's part of the scheme
    return Just(
      new ConceptStub({
        identifier,
        modelFetcher: this.modelFetcher,
      }),
    );
  }

  async *concepts(): AsyncGenerator<
    ConceptStub<SparqlConceptT, SparqlConceptSchemeT>
  > {
    yield* this._concepts({ topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptStub<SparqlConceptT, SparqlConceptSchemeT>[]> {
    return this._conceptsPage({ limit, offset, topOnly: false });
  }

  equals(other: IConceptScheme): boolean {
    return IConceptScheme.equals(this, other);
  }

  async *topConcepts(): AsyncGenerator<
    ConceptStub<SparqlConceptT, SparqlConceptSchemeT>
  > {
    yield* this._concepts({ topOnly: true });
  }

  async topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }

  async topConceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptStub<SparqlConceptT, SparqlConceptSchemeT>[]> {
    return this._conceptsPage({ limit, offset, topOnly: true });
  }

  private async _conceptIdentifiersPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly Identifier[]> {
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT DISTINCT ?concept
WHERE {
  ${this.conceptGraphPatterns({ topOnly }).join(" UNION ")}  
}
LIMIT ${limit}
OFFSET ${offset}`),
      "concept",
    );
  }

  private conceptGraphPatterns({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly string[] {
    const identifierString = Resource.Identifier.toString(this.identifier);
    const conceptGraphPatterns = [
      `{ ${identifierString} <${skos.hasTopConcept.value}> ?concept . }`,
      `{ ?concept <${skos.topConceptOf.value}> ${identifierString} . }`,
    ];
    if (!topOnly) {
      // skos:inScheme has an open domain, so we also have to check the rdf:type
      conceptGraphPatterns.push(
        `{ ?concept <${skos.inScheme.value}> ${identifierString} . ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> . }`,
      );
    }
    return conceptGraphPatterns;
  }
}

export namespace ConceptScheme {
  export interface Parameters<
    MemConceptSchemeT extends IConceptScheme,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  > {
    memModel: MemConceptSchemeT;
    modelFetcher: ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>;
    sparqlClient: SparqlClient;
  }
}
