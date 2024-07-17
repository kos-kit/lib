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
import { ConceptStub } from "./ConceptStub.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";

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
  ): ConceptStub<SparqlConceptT, SparqlConceptSchemeT> {
    return new ConceptStub({
      identifier,
      modelFetcher: this.modelFetcher,
    });
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
    ConceptStub<SparqlConceptT, SparqlConceptSchemeT>
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
  }): Promise<readonly ConceptStub<SparqlConceptT, SparqlConceptSchemeT>[]> {
    return (
      await this.conceptIdentifiersPage({
        limit,
        offset,
      })
    ).map(
      (identifier) =>
        new ConceptStub({
          identifier,
          modelFetcher: this.modelFetcher,
        }),
    );
  }

  conceptSchemeByIdentifier(
    identifier: IConceptScheme.Identifier,
  ): ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT> {
    return new ConceptSchemeStub({
      identifier,
      modelFetcher: this.modelFetcher,
    });
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
    readonly ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT>[]
  > {
    return (await this.conceptSchemeIdentifiers()).map(
      (identifier) =>
        new ConceptSchemeStub({ identifier, modelFetcher: this.modelFetcher }),
    );
  }
}
