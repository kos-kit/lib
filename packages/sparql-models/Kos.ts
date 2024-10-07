import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DatasetCoreFactory } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { IndentedString } from "./IndentedString.js";
import { mapBindingsToCount } from "./mapBindingsToCount.js";
import { mapBindingsToIdentifiers } from "./mapBindingsToIdentifiers.js";

export abstract class Kos<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends abc.Kos<ConceptT, ConceptSchemeT, LabelT> {
  readonly sparqlQueryClient: SparqlQueryClient;
  protected readonly datasetCoreFactory: DatasetCoreFactory;

  constructor({
    datasetCoreFactory,
    sparqlQueryClient,
    ...superParameters
  }: {
    datasetCoreFactory: DatasetCoreFactory;
    sparqlQueryClient: SparqlQueryClient;
  } & abc.Kos.Parameters) {
    super(superParameters);
    this.datasetCoreFactory = datasetCoreFactory;
    this.sparqlQueryClient = sparqlQueryClient;
  }

  async conceptSchemesCount(query: ConceptSchemesQuery): Promise<number> {
    return mapBindingsToCount(
      await this.sparqlQueryClient.queryBindings(`\
SELECT (COUNT(DISTINCT ?conceptScheme) AS ?count)
WHERE {
${this.conceptSchemesQueryToWhereGraphPatterns(query).join("\n")}
}`),
      "count",
    );
  }

  async conceptsCount(query: ConceptsQuery): Promise<number> {
    return mapBindingsToCount(
      await this.sparqlQueryClient.queryBindings(`\
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
${this.conceptsQueryToWhereGraphPatterns(query).join("\n")}
}`),
      "count",
    );
  }

  protected async queryConceptSchemes({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<readonly Identifier[]> {
    return mapBindingsToIdentifiers(
      await this.sparqlQueryClient.queryBindings(`\
SELECT DISTINCT ?conceptScheme
WHERE {
${this.conceptSchemesQueryToWhereGraphPatterns(query).join("\n")}
}
ORDER BY ?conceptScheme
${limit !== null && limit > 0 ? `LIMIT ${limit}` : ""}
${offset > 0 ? `OFFSET ${offset}` : ""}
`),
      "conceptScheme",
    );
  }

  protected async queryConcepts({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<readonly Identifier[]> {
    return mapBindingsToIdentifiers(
      await this.sparqlQueryClient.queryBindings(`\
SELECT DISTINCT ?concept
WHERE {
${this.conceptsQueryToWhereGraphPatterns(query).join("\n")}
}
ORDER BY ?concept
${limit !== null && limit > 0 ? `LIMIT ${limit}` : ""}
${offset > 0 ? `OFFSET ${offset}` : ""}
`),
      "concept",
    );
  }

  private conceptSchemesQueryToWhereGraphPatterns(
    query: ConceptSchemesQuery,
  ): string[] {
    if (query.type === "All") {
      return [
        GraphPattern.toWhereString(
          GraphPattern.whereRdfType(
            BasicGraphPattern.variable("conceptScheme"),
            skos.ConceptScheme,
          ),
        ),
      ];
    }

    const whereGraphPatterns: string[] = [
      `VALUES ?concept { ${Identifier.toString(query.conceptIdentifier)} }`,
      // skos:topConceptOf's range is skos:ConceptScheme, so we don't have to check the rdf:type
      `{ ?concept <${skos.topConceptOf.value}> ?conceptScheme . }`,
      "UNION",
      // skos:hasTopConcept's domain is skos:ConceptScheme, so we don't have to check the rdf:type
      `{ ?conceptScheme <${skos.hasTopConcept.value}> ?concept . }`,
    ];

    if (query.type === "HasConcept") {
      whereGraphPatterns.push(
        "UNION",
        // skos:inScheme has an open domain, so we have to check the concept's rdf:type
        `{ ?concept <${skos.inScheme.value}> ?conceptScheme . }`,
      );
    }

    return whereGraphPatterns;
  }

  private conceptsQueryToWhereGraphPatterns(
    query: ConceptsQuery,
  ): readonly string[] {
    if (query.type === "All") {
      return GraphPattern.toWhereIndentedStrings(
        GraphPattern.whereRdfType(
          BasicGraphPattern.variable("concept"),
          skos.Concept,
        ),
        0,
      ).map(IndentedString.toString);
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
            `VALUES ?concept { ${Identifier.toString(
              query.conceptIdentifier,
            )} }`,
            `{ ?concept <${skos.inScheme.value}> ${conceptSchemeIdentifierString} }`,
            "UNION",
          );
        } else {
          whereGraphPatterns.push(
            // skos:inScheme has an open domain, so we have to check the concept's rdf:type
            `{ ?concept <${
              skos.inScheme.value
            }> ${conceptSchemeIdentifierString} . ${GraphPattern.toWhereString(
              GraphPattern.whereRdfType(
                BasicGraphPattern.variable("concept"),
                skos.Concept,
              ),
            )} }`,
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

    if (query.type === "ObjectsOfSemanticRelation") {
      return [
        // The semantic relations have a range of skos:Concept, so no need to check the rdf:type
        `${Identifier.toString(query.subjectConceptIdentifier)} <${
          query.semanticRelationType.property.value
        }> ?concept`,
      ];
    }

    if (query.type === "SubjectsOfSemanticRelation") {
      return [
        // The semantic relations have a domain of skos:Concept, so no need to check the rdf:type
        `?concept <${
          query.semanticRelationType.property.value
        }> ${Identifier.toString(query.objectConceptIdentifier)}`,
      ];
    }

    throw new RangeError("should never reach this code");
  }
}
