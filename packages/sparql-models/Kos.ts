import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
  Identifier,
} from "@kos-kit/models";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { SparqlClient } from "./SparqlClient.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";

export class Kos<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> implements IKos
{
  private static readonly CONCEPT_IDENTIFIER_GRAPH_PATTERN =
    `?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .`;
  private static readonly CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN =
    `?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .`;

  private readonly sparqlClient: SparqlClient;

  constructor({
    sparqlClient,
  }: {
    sparqlClient: SparqlClient;
  }) {
    this.sparqlClient = sparqlClient;
  }

  conceptByIdentifier(
    identifier: Identifier,
  ): ConceptStub<SparqlConceptT, SparqlConceptSchemeT, LabelT> {
    return new ConceptStub({
      identifier,
      modelFetcher: this.modelFetcher,
    });
  }

  async *concepts(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptsQuery;
  }): AsyncGenerator<ConceptStub<SparqlConceptT, SparqlConceptSchemeT>> {
    for (const identifier of mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT ?conceptScheme
WHERE {
${this.conceptsQueryToWhereGraphPatterns(kwds?.query).join("\n")}
}
${kwds?.limit && kwds.limit > 0 ? `LIMIT ${kwds.limit}` : ""}
${kwds?.offset && kwds.offset >= 0 ? `OFFSET ${kwds.offset}` : ""}
`),
      "conceptScheme",
    )) {
      yield this.conceptByIdentifier(identifier);
    }
  }

  async conceptsCount(query?: ConceptsQuery): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(?concept) AS ?count)
WHERE {
${this.conceptsQueryToWhereGraphPatterns(query).join("\n")}
}`),
      "count",
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

  async *conceptSchemes(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptSchemesQuery;
  }): AsyncGenerator<ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT>> {
    for (const identifier of mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT ?conceptScheme
WHERE {
${this.conceptSchemesQueryToWhereGraphPatterns(kwds?.query).join("\n")}
}
${kwds?.limit && kwds.limit > 0 ? `LIMIT ${kwds.limit}` : ""}
${kwds?.offset && kwds.offset >= 0 ? `OFFSET ${kwds.offset}` : ""}
`),
      "conceptScheme",
    )) {
      yield this.conceptSchemeByIdentifier(identifier);
    }
  }

  async conceptSchemesCount(query?: ConceptSchemesQuery): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(DISTINCT ?conceptScheme) AS ?count)
WHERE {
${this.conceptSchemesQueryToWhereGraphPatterns(query).join("\n")}
}`),
      "count",
    );
  }

  private conceptsQueryToWhereGraphPatterns(
    query?: ConceptsQuery,
  ): readonly string[] {
    if (!query) {
      return [Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN];
    }

    if (query.type === "InScheme" || query.type === "TopConceptOf") {
      const whereGraphPatterns: string[] = [];

      const conceptSchemeIdentifierString = Identifier.toString(
        query.conceptSchemeIdentifier,
      );

      if (query.type === "InScheme") {
        if (query.conceptIdentifier) {
          whereGraphPatterns.push(
            // Put the VALUES pattern first
            `VALUES ?concept { ${Identifier.toString(query.conceptIdentifier)} }`,
            `{ ?concept <${skos.inScheme.value}> ${conceptSchemeIdentifierString} }`,
            "UNION",
          );
        } else {
          whereGraphPatterns.push(
            // skos:inScheme has an open domain, so we have to check the concept's rdf:type
            `{ ?concept <${skos.inScheme.value}> ${conceptSchemeIdentifierString} . ${Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN} . }`,
            "UNION",
          );
        }
      }

      whereGraphPatterns.push(
        // skos:topConceptOf's domain is skos:Concept, so we don't have to check the rdf:type
        `{ ?concept <${skos.topConceptOf.value}> ${conceptSchemeIdentifierString} }`,
        "UNION",
        // skos:hasTopConcept's range is skos:Concept, so we don't have to check the rdf:type
        `{ ${conceptSchemeIdentifierString} <${skos.hasTopConcept.value}> ?concept }`,
      );

      return whereGraphPatterns;
    }

    if (query.type === "SemanticRelationOf") {
      return [
        // The semantic relations have a range of skos:Concept, so no need to check the rdf:type
        `${Identifier.toString(query.subjectConceptIdentifier)} <${query.semanticRelationProperty.identifier.value}> ?concept`,
      ];
    }

    throw new RangeError();
  }

  private conceptSchemesQueryToWhereGraphPatterns(
    query?: ConceptSchemesQuery,
  ): string[] {
    const whereGraphPatterns: string[] = [
      Kos.CONCEPT_SCHEME_IDENTIFIER_GRAPH_PATTERN,
    ];

    if (!query) {
      return whereGraphPatterns;
    }

    if (query.type === "HasConcept" || query.type === "HasTopConcept") {
      whereGraphPatterns.push(
        // skos:topConceptOf's domain is skos:Concept, so we don't have to check the rdf:type
        `{ ?concept <${skos.topConceptOf.value}> ?conceptScheme . }`,
        "UNION",
        // skos:hasTopConcept's range is skos:Concept, so we don't have to check the rdf:type
        `{ ?conceptScheme <${skos.hasTopConcept.value}> ?concept . }`,
      );

      if (query.type === "HasConcept") {
        whereGraphPatterns.push(
          "UNION",
          // skos:inScheme has an open domain, so we have to check the concept's rdf:type
          `{ ?concept <${skos.inScheme.value}> ?conceptScheme . ${Kos.CONCEPT_IDENTIFIER_GRAPH_PATTERN} }`,
        );
      }
    }

    return whereGraphPatterns;
  }
}
