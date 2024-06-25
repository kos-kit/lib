import { ConceptScheme as IConceptScheme } from "@kos-kit/models";
import { ConceptScheme as MemConceptScheme } from "@kos-kit/mem-models";
import { LabeledModel as LabeledModel } from "./LabeledModel.js";
import { Concept } from "./Concept.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { Resource } from "@kos-kit/rdf-resource";
import { paginationToAsyncGenerator } from "./paginationToAsyncGenerator.js";
import { skos } from "@tpluscode/rdf-ns-builders";

export class ConceptScheme
  extends LabeledModel<MemConceptScheme>
  implements IConceptScheme
{
  private get conceptGraphPatterns(): readonly string[] {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return this.topConceptGraphPatterns.concat(
      `{ ?concept <${skos.inScheme.value}> ${identifierString} . }`,
    );
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
SELECT DISTINCT ?concept
WHERE {
  ${this.conceptGraphPatterns.join(" UNION ")}  
}
LIMIT ${limit}
OFFSET ${offset}`),
      "concept",
    );
  }

  async *concepts(): AsyncGenerator<Concept> {
    yield* paginationToAsyncGenerator({
      getPage: ({ offset }) => this.conceptsPage({ limit: 100, offset }),
      totalCount: await this.conceptsCount(),
    });
  }

  async conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return this.kos.conceptsByIdentifiers(
      await this.conceptIdentifiersPage({ limit, offset }),
    );
  }

  async conceptsCount(): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
  ${this.conceptGraphPatterns.join(" UNION ")}
}`),
      "count",
    );
  }

  async topConceptsCount(): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
  ${this.topConceptGraphPatterns.join(" UNION ")}
}`),
      "count",
    );
  }

  private get topConceptGraphPatterns(): readonly string[] {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return [
      `{ ${identifierString} <${skos.hasTopConcept.value}> ?concept . }`,
      `{ ?concept <${skos.topConceptOf.value}> ${identifierString} . }`,
    ];
  }

  private async topConceptIdentifiersPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Resource.Identifier[]> {
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT DISTINCT ?concept
WHERE {
  ${this.topConceptGraphPatterns.join(" UNION ")}  
}
LIMIT ${limit}
OFFSET ${offset}`),
      "concept",
    );
  }

  async *topConcepts(): AsyncGenerator<Concept> {
    yield* paginationToAsyncGenerator({
      getPage: ({ offset }) => this.topConceptsPage({ limit: 100, offset }),
      totalCount: await this.topConceptsCount(),
    });
  }

  async topConceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return this.kos.conceptsByIdentifiers(
      await this.topConceptIdentifiersPage({ limit, offset }),
    );
  }
}
