import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";

import * as mem from "@kos-kit/mem-models";
import { Kos as IKos, LanguageTagSet } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import { GraphPatternVariable } from "./GraphPattern.js";
import { SparqlClient } from "./SparqlClient.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { paginationToAsyncIterable } from "./paginationToAsyncIterable.js";

export class Kos implements IKos {
  private static readonly CONCEPT_IDENTIFIER_GRAPH_PATTERN = `?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .`;
  private static readonly CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN = `?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .`;

  readonly includeLanguageTags: LanguageTagSet;
  protected readonly memModelFactory: mem.ModelFactory;
  readonly sparqlClient: SparqlClient;

  constructor({
    includeLanguageTags,
    memModelFactory,
    sparqlClient,
  }: {
    includeLanguageTags: LanguageTagSet;
    memModelFactory?: mem.ModelFactory;
    sparqlClient: SparqlClient;
  }) {
    this.includeLanguageTags = includeLanguageTags;
    this.memModelFactory = memModelFactory ?? new mem.ModelFactory();
    this.sparqlClient = sparqlClient;
  }

  async conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<O.Option<Concept>> {
    for (const concept of await this.conceptsByIdentifiers([identifier])) {
      return O.some(concept);
    }
    return O.none;
  }

  private async conceptIdentifiersPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Resource.Identifier[]> {
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

  async *concepts(): AsyncIterable<Concept> {
    yield* paginationToAsyncIterable({
      getPage: ({ offset }) => this.conceptsPage({ limit: 100, offset }),
      totalCount: await this.conceptsCount(),
    });
  }

  async conceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Concept[]> {
    const conceptVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "concept",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(
          ...Concept.propertyGraphPatterns({
            subject: conceptVariable,
            variablePrefix: conceptVariable.value,
          }),
        )
        .addValues(conceptVariable, ...identifiers)
        .build(),
      { operation: "postDirect" },
    );
    return identifiers.map((identifier) =>
      this.createConcept({ dataset, identifier }),
    );
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
  }): Promise<readonly Concept[]> {
    return this.conceptsByIdentifiers(
      await this.conceptIdentifiersPage({
        limit,
        offset,
      }),
    );
  }

  async conceptSchemeByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<O.Option<ConceptScheme>> {
    for (const conceptScheme of await this.conceptSchemesByIdentifiers([
      identifier,
    ])) {
      return O.some(conceptScheme);
    }
    return O.none;
  }

  async conceptSchemesByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly ConceptScheme[]> {
    const conceptSchemeVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "conceptScheme",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(
          ...ConceptScheme.propertyGraphPatterns({
            subject: conceptSchemeVariable,
            variablePrefix: conceptSchemeVariable.value,
          }),
        )
        .addValues(conceptSchemeVariable, ...identifiers)
        .build(),
      { operation: "postDirect" },
    );
    return identifiers.map((identifier) =>
      this.createConceptScheme({ dataset, identifier }),
    );
  }

  private async conceptSchemeIdentifiers(): Promise<
    readonly Resource.Identifier[]
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

  async conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return this.conceptSchemesByIdentifiers(
      await this.conceptSchemeIdentifiers(),
    );
  }

  protected createConcept({
    dataset,
    identifier,
  }: {
    dataset: DatasetCore;
    identifier: BlankNode | NamedNode;
  }): Concept {
    return new Concept({
      kos: this,
      memModel: this.memModelFactory.createConcept({
        identifier,
        kos: new mem.Kos({
          dataset,
          includeLanguageTags: this.includeLanguageTags,
          modelFactory: this.memModelFactory,
        }),
      }),
    });
  }

  protected createConceptScheme({
    dataset,
    identifier,
  }: {
    dataset: DatasetCore;
    identifier: BlankNode | NamedNode;
  }): ConceptScheme {
    return new ConceptScheme({
      kos: this,
      memModel: this.memModelFactory.createConceptScheme({
        identifier,
        kos: new mem.Kos({
          dataset,
          includeLanguageTags: this.includeLanguageTags,
          modelFactory: this.memModelFactory,
        }),
      }),
    });
  }
}
