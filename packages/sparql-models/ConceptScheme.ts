import {
  Concept,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { LabeledModel } from "./LabeledModel.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { paginationToAsyncIterable } from "./paginationToAsyncIterable.js";

export class ConceptScheme<
    MemConceptSchemeT extends IConceptScheme,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends LabeledModel<MemConceptSchemeT, SparqlConceptT, SparqlConceptSchemeT>
  implements IConceptScheme
{
  async conceptByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<O.Option<Concept>> {
    if (
      await this.sparqlClient.query.ask(`\
ASK {
  VALUES ?concept { ${Resource.Identifier.toString(identifier)}}
  ${this.conceptGraphPatterns({ topOnly: false }).join(" UNION ")}
}`)
    ) {
      return O.some(
        (await this.modelFetcher.fetchConceptsByIdentifiers([identifier]))[0],
      );
    } else {
      return O.none;
    }
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
      conceptGraphPatterns.push(
        `{ ?concept <${skos.inScheme.value}> ${identifierString} . }`,
      );
    }
    return conceptGraphPatterns;
  }

  private async _conceptIdentifiersPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly Resource.Identifier[]> {
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

  async *_concepts({ topOnly }: { topOnly: boolean }): AsyncIterable<Concept> {
    yield* paginationToAsyncIterable({
      getPage: ({ offset }) =>
        this._conceptsPage({ limit: 100, offset, topOnly }),
      totalCount: await this._conceptsCount({ topOnly }),
    });
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
  }): Promise<readonly Concept[]> {
    return this.modelFetcher.fetchConceptsByIdentifiers(
      await this._conceptIdentifiersPage({ limit, offset, topOnly }),
    );
  }

  concepts(): AsyncIterable<Concept> {
    return this._concepts({ topOnly: false });
  }

  conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return this._conceptsPage({ limit, offset, topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  async topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }

  topConcepts(): AsyncIterable<Concept> {
    return this._concepts({ topOnly: true });
  }

  async topConceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return this._conceptsPage({ limit, offset, topOnly: true });
  }
}
