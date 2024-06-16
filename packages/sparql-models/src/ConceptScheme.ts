import { ConceptScheme as IConceptScheme } from "@kos-kit/models";
import { ConceptScheme as MemConceptScheme } from "@kos-kit/mem-models";
import { LabeledModel as LabeledModel } from "./LabeledModel";
import { Concept } from "./Concept";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers";
import { mapResultRowsToCount } from "./mapResultRowsToCount";
import { Resource } from "@kos-kit/rdf-resource";
import { paginationToAsyncGenerator } from "./paginationToAsyncGenerator";
import { skos } from "@kos-kit/vocabularies";

export class ConceptScheme
  extends LabeledModel<MemConceptScheme>
  implements IConceptScheme
{
  async topConceptsCount(): Promise<number> {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
  { ${identifierString} <${skos.hasTopConcept.value}> ?concept . }
  UNION
  { ?concept <${skos.topConceptOf.value}> ${identifierString} . }
}`),
      "count",
    );
  }

  private async topConceptIdentifiersPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Resource.Identifier[]> {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT DISTINCT ?concept
WHERE {
  { ${identifierString} <${skos.hasTopConcept.value}> ?concept . }
  UNION
  { ?concept <${skos.topConceptOf.value}> ${identifierString} . }
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
