import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
} from "@kos-kit/models";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { paginationToAsyncIterable } from "./paginationToAsyncIterable.js";
import { Maybe } from "purify-ts";
import { StubConcept } from "./StubConcept.js";
import { StubConceptScheme } from "./StubConceptScheme.js";

export class Kos<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> implements IKos
{
  private static readonly CONCEPT_IDENTIFIER_GRAPH_PATTERN = `?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .`;
  private static readonly CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN = `?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .`;

  private readonly modelFetcher: ModelFetcher<
    SparqlConceptT,
    SparqlConceptSchemeT
  >;
  private readonly sparqlClient: SparqlClient;

  constructor({
    modelFetcher,
    sparqlClient,
  }: {
    modelFetcher: ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>;
    sparqlClient: SparqlClient;
  }) {
    this.modelFetcher = modelFetcher;
    this.sparqlClient = sparqlClient;
  }

  conceptByIdentifier(
    identifier: IConcept.Identifier,
  ): Promise<Maybe<SparqlConceptT>> {
    return new StubConcept({
      identifier,
      modelFetcher: this.modelFetcher,
    }).resolve();
  }

  private async conceptIdentifiersPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly IConcept.Identifier[]> {
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT ?concept
WHERE {
  ${Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN}
}
LIMIT ${limit}
OFFSET ${offset}`),
      "concept",
    );
  }

  async *concepts(): AsyncIterable<
    StubConcept<SparqlConceptT, SparqlConceptSchemeT>
  > {
    yield* paginationToAsyncIterable({
      getPage: ({ offset }) => this.conceptsPage({ limit: 100, offset }),
      totalCount: await this.conceptsCount(),
    });
  }

  async conceptsCount(): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(?concept) AS ?count)
WHERE {
  ${Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN}
}`),
      "count",
    );
  }

  // eslint-disable-next-line no-empty-pattern
  async conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly StubConcept<SparqlConceptT, SparqlConceptSchemeT>[]> {
    return (
      await this.conceptIdentifiersPage({
        limit,
        offset,
      })
    ).map(
      (identifier) =>
        new StubConcept({
          identifier,
          modelFetcher: this.modelFetcher,
        }),
    );
  }

  conceptSchemeByIdentifier(
    identifier: IConceptScheme.Identifier,
  ): Promise<Maybe<SparqlConceptSchemeT>> {
    return new StubConceptScheme({
      identifier,
      modelFetcher: this.modelFetcher,
    }).resolve();
  }

  private async conceptSchemeIdentifiers(): Promise<
    readonly IConceptScheme.Identifier[]
  > {
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT ?conceptScheme
WHERE {
  ${Kos.CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN}
}`),
      "conceptScheme",
    );
  }

  async conceptSchemes(): Promise<
    readonly StubConceptScheme<SparqlConceptT, SparqlConceptSchemeT>[]
  > {
    return (await this.conceptSchemeIdentifiers()).map(
      (identifier) =>
        new StubConceptScheme({ identifier, modelFetcher: this.modelFetcher }),
    );
  }
}
