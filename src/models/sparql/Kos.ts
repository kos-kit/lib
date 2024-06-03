import { Identifier } from "../Identifier";
import { rdf, rdfs, skos } from "../../vocabularies";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import SparqlClient from "sparql-http-client/ParsingClient";
import { LanguageTagSet } from "../LanguageTagSet";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder";
import { mem } from "..";
import { GraphPatternVariable } from "./GraphPattern";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers";
import { mapResultRowsToCount } from "./mapResultRowsToCount";

export class Kos {
  private static readonly CONCEPT_IDENTIFIER_GRAPH_PATTERN = `?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .`;
  private static readonly CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN = `?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .`;

  readonly includeLanguageTags: LanguageTagSet;
  readonly sparqlClient: SparqlClient;

  constructor({
    includeLanguageTags,
    sparqlClient,
  }: {
    includeLanguageTags: LanguageTagSet;
    sparqlClient: SparqlClient;
  }) {
    this.includeLanguageTags = includeLanguageTags;
    this.sparqlClient = sparqlClient;
  }

  async conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    return (await this.conceptsByIdentifiers([identifier]))[0];
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

  async *concepts(): AsyncGenerator<Concept, any, unknown> {
    const conceptsCount = await this.conceptsCount();
    const limit = 100;
    let offset = 0;
    while (offset < conceptsCount) {
      for (const concept of await this.conceptsPage({ limit, offset })) {
        yield concept;
        offset++;
      }
    }
  }

  async conceptsByIdentifiers(
    identifiers: readonly Identifier[],
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
        .addGraphPatterns(...Concept.propertyGraphPatterns(conceptVariable))
        .addValues(conceptVariable, ...identifiers)
        .build(),
    );
    return identifiers.map(
      (identifier) =>
        new Concept({
          kos: this,
          memModel: new mem.Concept({
            dataset,
            identifier,
            includeLanguageTags,
          }),
        }),
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
    identifier: Identifier,
  ): Promise<ConceptScheme> {
    return (await this.conceptSchemesByIdentifiers([identifier]))[0];
  }

  async conceptSchemesByIdentifiers(
    identifiers: readonly Identifier[],
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
          ...ConceptScheme.propertyGraphPatterns(conceptSchemeVariable),
        )
        .addValues(conceptSchemeVariable, ...identifiers)
        .build(),
    );
    return identifiers.map(
      (identifier) =>
        new ConceptScheme({
          kos: this,
          memModel: new mem.ConceptScheme({
            dataset,
            identifier,
            includeLanguageTags,
          }),
        }),
    );
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

  async conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return this.conceptSchemesByIdentifiers(
      await this.conceptSchemeIdentifiers(),
    );
  }
}
