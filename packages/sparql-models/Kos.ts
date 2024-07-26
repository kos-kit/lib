import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Identifier,
  Kos as IKos,
} from "@kos-kit/models";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
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
    identifier: Identifier,
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
  }): Promise<readonly Identifier[]> {
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

  async *concepts(): AsyncGenerator<
    ConceptStub<SparqlConceptT, SparqlConceptSchemeT>
  > {
    const count = await this.conceptsCount();
    let offset = 0;
    while (offset < count) {
      for (const value of await this.conceptsPage({ limit: 100, offset })) {
        yield value;
        offset++;
      }
    }
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
    identifier: Identifier,
  ): ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT> {
    return new ConceptSchemeStub({
      identifier,
      modelFetcher: this.modelFetcher,
    });
  }

  private async conceptSchemeIdentifiers(): Promise<readonly Identifier[]> {
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT ?conceptScheme
WHERE {
  ${Kos.CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN}
}`),
      "conceptScheme",
    );
  }

  async *conceptSchemes(): AsyncGenerator<
    ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT>
  > {
    for (const identifier of await this.conceptSchemeIdentifiers()) {
      yield new ConceptSchemeStub({
        identifier,
        modelFetcher: this.modelFetcher,
      });
    }
  }
}
