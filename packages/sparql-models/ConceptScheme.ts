import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { ConceptStub } from "./ConceptStub.js";
import { Just, Maybe } from "purify-ts";

export class ConceptScheme<
    MemConceptSchemeT extends IConceptScheme,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends LabeledModel<MemConceptSchemeT, SparqlConceptT, SparqlConceptSchemeT>
  implements IConceptScheme
{
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
    identifier: IConcept.Identifier,
  ): Promise<Maybe<ConceptStub<SparqlConceptT, SparqlConceptSchemeT>>> {
    // TODO: verify it's part of the scheme
    return Just(
      new ConceptStub({
        identifier,
        modelFetcher: this.modelFetcher,
      }),
    );
  }

  concepts(): AsyncGenerator<
    ConceptStub<SparqlConceptT, SparqlConceptSchemeT>
  > {
    return this._concepts({ topOnly: false });
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

  topConcepts(): AsyncGenerator<
    ConceptStub<SparqlConceptT, SparqlConceptSchemeT>
  > {
    return this._concepts({ topOnly: true });
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
  }): Promise<readonly IConcept.Identifier[]> {
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
