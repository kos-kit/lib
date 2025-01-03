import {
  ConstructQueryBuilder,
  GraphPattern,
  RdfTypeGraphPatterns,
} from "@kos-kit/sparql-builder";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import {
  mapBindingsToCount,
  mapBindingsToIdentifiers,
} from "@kos-kit/sparql-models";
import { DatasetCoreFactory } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { ModelFactories } from "./ModelFactories.js";
import { ModelFactory } from "./ModelFactory.js";
import {
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptSchemesQuery,
  ConceptStub,
  ConceptsQuery,
  Identifier,
  Kos,
  LanguageTag,
} from "./index.js";

export class SparqlKos<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptStubT extends ConceptStub = ConceptStub,
> implements Kos<ConceptT, ConceptSchemeT, ConceptSchemeStubT, ConceptStubT>
{
  private readonly datasetCoreFactory: DatasetCoreFactory;
  private readonly languageIn: readonly LanguageTag[];
  private readonly modelFactories: ModelFactories<
    ConceptT,
    ConceptSchemeT,
    ConceptSchemeStubT,
    ConceptStubT
  >;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    datasetCoreFactory,
    languageIn,
    modelFactories,
    sparqlQueryClient,
  }: {
    datasetCoreFactory: DatasetCoreFactory;
    languageIn: readonly LanguageTag[];
    modelFactories: ModelFactories<
      ConceptT,
      ConceptSchemeT,
      ConceptSchemeStubT,
      ConceptStubT
    >;
    sparqlQueryClient: SparqlQueryClient;
  }) {
    this.datasetCoreFactory = datasetCoreFactory;
    this.languageIn = languageIn;
    this.modelFactories = modelFactories;
    this.sparqlQueryClient = sparqlQueryClient;
  }

  async concept(identifier: Identifier): Promise<Either<Error, ConceptT>> {
    return this.modelByIdentifier({
      identifier,
      modelFactory: this.modelFactories.concept,
    });
  }

  async conceptIdentifiers({
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

  async conceptScheme(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeT>> {
    return this.modelByIdentifier({
      identifier,
      modelFactory: this.modelFactories.conceptScheme,
    });
  }

  async conceptSchemeIdentifiers({
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

  async conceptSchemeStubs(_parameters: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<readonly ConceptSchemeStubT[]> {
    throw new Error("not implemented");
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

  async conceptStubs(_parameters: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<readonly ConceptStubT[]> {
    throw new Error("not implemented");
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

  private conceptSchemesQueryToWhereGraphPatterns(
    query: ConceptSchemesQuery,
  ): string[] {
    if (query.type === "All") {
      return [
        new RdfTypeGraphPatterns(
          GraphPattern.variable("conceptScheme"),
          skos.ConceptScheme,
        ).toWhereString(),
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
      return new RdfTypeGraphPatterns(
        GraphPattern.variable("concept"),
        skos.Concept,
      ).toWhereStrings();
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
            }> ${conceptSchemeIdentifierString} . ${new RdfTypeGraphPatterns(
              GraphPattern.variable("concept"),
              skos.Concept,
            ).toWhereString()} }`,
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
          query.semanticRelationProperty.identifier.value
        }> ?concept`,
      ];
    }

    if (query.type === "SubjectsOfSemanticRelation") {
      return [
        // The semantic relations have a domain of skos:Concept, so no need to check the rdf:type
        `?concept <${
          query.semanticRelationProperty.identifier.value
        }> ${Identifier.toString(query.objectConceptIdentifier)}`,
      ];
    }

    throw new RangeError("should never reach this code");
  }

  private async modelByIdentifier<ModelT>({
    identifier,
    modelFactory,
  }: { identifier: Identifier; modelFactory: ModelFactory<ModelT> }): Promise<
    Either<Resource.ValueError, ModelT>
  > {
    const subjectVariable = GraphPattern.variable("subject");
    const quads = await this.sparqlQueryClient.queryQuads(
      new ConstructQueryBuilder({
        includeLanguageTags: this.languageIn,
      })
        .addGraphPatterns(
          new this.modelFactories.concept.SparqlGraphPatterns(subjectVariable),
        )
        .addValues(subjectVariable, identifier)
        .build(),
    );

    return modelFactory.fromRdf({
      languageIn: this.languageIn,
      resource: new Resource({
        dataset: this.datasetCoreFactory.dataset(quads.concat()),
        identifier: identifier,
      }),
    });
  }
}
