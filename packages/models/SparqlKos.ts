import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DataFactory, DatasetCoreFactory, Variable } from "@rdfjs/types";
import { dcterms, rdf, rdfs, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import sparqljs from "sparqljs";
import { ModelFactories } from "./ModelFactories.js";
import { ModelFactory } from "./ModelFactory.js";
import {
  Concept,
  ConceptQuery,
  ConceptScheme,
  ConceptSchemeQuery,
  ConceptSchemeStub,
  ConceptStub,
  Identifier,
  Kos,
  LanguageTag,
  mapBindingsToCount,
  mapBindingsToIdentifiers,
} from "./index.js";
import { sparqlRdfTypePattern } from "./sparqlRdfTypePattern.js";

const prefixes = {
  dct: dcterms[""].value,
  rdf: rdf[""].value,
  rdfs: rdfs[""].value,
  skos: skos[""].value,
  "skos-xl": skosxl[""].value,
};

export class SparqlKos<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptStubT extends ConceptStub = ConceptStub,
> implements Kos<ConceptT, ConceptSchemeT, ConceptSchemeStubT, ConceptStubT>
{
  private readonly conceptSchemeVariable: Variable;
  private readonly conceptVariable: Variable;
  private readonly countVariable: Variable;
  private readonly datasetCoreFactory: DatasetCoreFactory;
  private readonly languageIn: readonly LanguageTag[];
  private readonly modelFactories: ModelFactories<
    ConceptT,
    ConceptSchemeT,
    ConceptSchemeStubT,
    ConceptStubT
  >;
  private readonly modelVariable: Variable;
  private readonly sparqlGenerator: sparqljs.SparqlGenerator;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    dataFactory,
    datasetCoreFactory,
    languageIn,
    modelFactories,
    sparqlQueryClient,
  }: {
    dataFactory: DataFactory;
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
    this.conceptVariable = dataFactory.variable!("concept");
    this.conceptSchemeVariable = dataFactory.variable!("conceptScheme");
    this.countVariable = dataFactory.variable!("count");
    this.datasetCoreFactory = datasetCoreFactory;
    this.languageIn = languageIn;
    this.modelFactories = modelFactories;
    this.modelVariable = dataFactory.variable!("model");
    this.sparqlGenerator = new sparqljs.Generator();
    this.sparqlQueryClient = sparqlQueryClient;
  }

  async concept(identifier: Identifier): Promise<Either<Error, ConceptT>> {
    return (
      await this.modelsByIdentifiers({
        identifiers: [identifier],
        modelFactory: this.modelFactories.concept,
      })
    )[0];
  }

  async conceptIdentifiers({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<readonly Identifier[]> {
    return mapBindingsToIdentifiers(
      await this.sparqlQueryClient.queryBindings(
        this.sparqlGenerator.stringify({
          distinct: true,
          limit: limit ?? undefined,
          offset,
          order: [{ expression: this.conceptVariable }],
          prefixes,
          queryType: "SELECT",
          type: "query",
          variables: [this.conceptVariable],
          where: this.conceptsQueryToWhereGraphPatterns(query).concat(),
        }),
      ),
      this.conceptVariable.value,
    );
  }

  async conceptScheme(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeT>> {
    return (
      await this.modelsByIdentifiers({
        identifiers: [identifier],
        modelFactory: this.modelFactories.conceptScheme,
      })
    )[0];
  }

  async conceptSchemeIdentifiers({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<readonly Identifier[]> {
    return mapBindingsToIdentifiers(
      await this.sparqlQueryClient.queryBindings(
        this.sparqlGenerator.stringify({
          distinct: true,
          limit: limit ?? undefined,
          offset,
          order: [{ expression: this.conceptSchemeVariable }],
          prefixes,
          queryType: "SELECT",
          type: "query",
          variables: [this.conceptSchemeVariable],
          where: this.conceptSchemesQueryToWhereGraphPatterns(query).concat(),
        }),
      ),
      this.conceptSchemeVariable.value,
    );
  }

  async conceptSchemeStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeStubT>> {
    return (
      await this.modelsByIdentifiers({
        identifiers: [identifier],
        modelFactory: this.modelFactories.conceptSchemeStub,
      })
    )[0];
  }

  async conceptSchemeStubs(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<readonly ConceptSchemeStubT[]> {
    const identifiers = await this.conceptSchemeIdentifiers(parameters);
    const modelEithers = await this.modelsByIdentifiers({
      identifiers: identifiers,
      modelFactory: this.modelFactories.conceptSchemeStub,
    });
    if (modelEithers.length !== identifiers.length) {
      throw new Error("should never happen");
    }
    return modelEithers.map((modelEither, index) =>
      modelEither
        .mapLeft(() =>
          this.modelFactories.conceptSchemeStub.fromIdentifier(
            identifiers[index],
          ),
        )
        .extract(),
    );
  }

  async conceptSchemesCount(query: ConceptSchemeQuery): Promise<number> {
    return mapBindingsToCount(
      await this.sparqlQueryClient.queryBindings(
        this.sparqlGenerator.stringify({
          distinct: true,
          prefixes,
          queryType: "SELECT",
          type: "query",
          variables: [
            {
              expression: {
                aggregation: "COUNT",
                distinct: true,
                expression: this.conceptSchemeVariable,
                type: "aggregate",
              },
              variable: this.countVariable,
            },
          ],
          where: this.conceptSchemesQueryToWhereGraphPatterns(query).concat(),
        }),
      ),
      this.countVariable.value,
    );
  }

  async conceptStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptStubT>> {
    return (
      await this.modelsByIdentifiers({
        identifiers: [identifier],
        modelFactory: this.modelFactories.conceptStub,
      })
    )[0];
  }

  async conceptStubs(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<readonly ConceptStubT[]> {
    const identifiers = await this.conceptIdentifiers(parameters);
    const modelEithers = await this.modelsByIdentifiers({
      identifiers: identifiers,
      modelFactory: this.modelFactories.conceptStub,
    });
    if (modelEithers.length !== identifiers.length) {
      throw new Error("should never happen");
    }
    return modelEithers.map((modelEither, index) =>
      modelEither
        .mapLeft(() =>
          this.modelFactories.conceptStub.fromIdentifier(identifiers[index]),
        )
        .extract(),
    );
  }

  async conceptsCount(query: ConceptQuery): Promise<number> {
    return mapBindingsToCount(
      await this.sparqlQueryClient.queryBindings(
        this.sparqlGenerator.stringify({
          distinct: true,
          prefixes,
          queryType: "SELECT",
          type: "query",
          variables: [
            {
              expression: {
                aggregation: "COUNT",
                distinct: true,
                expression: this.conceptVariable,
                type: "aggregate",
              },
              variable: this.countVariable,
            },
          ],
          where: this.conceptsQueryToWhereGraphPatterns(query).concat(),
        }),
      ),
      this.countVariable.value,
    );
  }

  private conceptSchemesQueryToWhereGraphPatterns(
    query: ConceptSchemeQuery,
  ): readonly sparqljs.Pattern[] {
    if (query.type === "All") {
      // rdf:type/rdfs:subClassOf* skos:ConceptScheme
      return [
        sparqlRdfTypePattern({
          rdfType: skos.ConceptScheme,
          subject: this.conceptSchemeVariable,
        }),
      ];
    }

    // Query type HasConcept or HasTopConcept
    const unionPatterns: sparqljs.Pattern[] = [
      {
        // skos:topConceptOf's range is skos:ConceptScheme, so we don't have to check the rdf:type
        triples: [
          {
            subject: query.conceptIdentifier,
            predicate: skos.topConceptOf,
            object: this.conceptSchemeVariable,
          },
        ],
        type: "bgp",
      },
      {
        // skos:hasTopConcept's domain is skos:ConceptScheme, so we don't have to check the rdf:type
        triples: [
          {
            subject: this.conceptSchemeVariable,
            predicate: skos.hasTopConcept,
            object: query.conceptIdentifier,
          },
        ],
        type: "bgp",
      },
    ];

    if (query.type === "HasConcept") {
      unionPatterns.push({
        triples: [
          {
            subject: query.conceptIdentifier,
            predicate: skos.inScheme,
            object: this.conceptSchemeVariable,
          },
        ],
        type: "bgp",
      });
    }

    return [
      {
        patterns: unionPatterns,
        type: "union",
      },
    ];
  }

  private conceptsQueryToWhereGraphPatterns(
    query: ConceptQuery,
  ): readonly sparqljs.Pattern[] {
    if (query.type === "All") {
      // rdf:type/rdfs:subClassOf* skos:ConceptScheme
      return [
        sparqlRdfTypePattern({
          rdfType: skos.Concept,
          subject: this.conceptVariable,
        }),
      ];
    }

    if (query.type === "InScheme" || query.type === "TopConceptOf") {
      const unionPatterns: sparqljs.Pattern[] = [];

      if (query.type === "InScheme") {
        if (query.conceptIdentifier) {
          unionPatterns.push({
            triples: [
              {
                subject: query.conceptIdentifier,
                predicate: skos.inScheme,
                object: query.conceptSchemeIdentifier,
              },
            ],
            type: "bgp",
          });
        } else {
          // skos:inScheme has an open domain, so we have to check the concept's rdf:type
          unionPatterns.push(
            {
              triples: [
                {
                  subject: this.conceptVariable,
                  predicate: skos.inScheme,
                  object: query.conceptSchemeIdentifier,
                },
              ],
              type: "bgp",
            },
            sparqlRdfTypePattern({
              subject: this.conceptVariable,
              rdfType: skos.ConceptScheme,
            }),
          );
          // `{ ?concept <${
          //   skos.inScheme.value
          // }> ${conceptSchemeIdentifierString} . ${new RdfTypeGraphPatterns(
          //   GraphPattern.variable("concept"),
          //   skos.Concept,
          // ).toWhereString()} }`,
          // "UNION",
        }
      }

      unionPatterns.push(
        {
          // skos:topConceptOf's domain is skos:Concept, so we don't have to check the rdf:type
          triples: [
            {
              subject: this.conceptVariable,
              predicate: skos.topConceptOf,
              object: query.conceptSchemeIdentifier,
            },
          ],
          type: "bgp",
        },
        {
          // skos:hasTopConcept's range is skos:Concept, so we don't have to check the rdf:type
          triples: [
            {
              subject: query.conceptSchemeIdentifier,
              predicate: skos.hasTopConcept,
              object: this.conceptVariable,
            },
          ],
          type: "bgp",
        },
      );

      return [{ patterns: unionPatterns, type: "union" }];
    }

    if (query.type === "ObjectsOfSemanticRelation") {
      return [
        // The semantic relations have a range of skos:Concept, so no need to check the rdf:type
        {
          triples: [
            {
              subject: query.subjectConceptIdentifier,
              predicate: query.semanticRelationProperty.identifier,
              object: this.conceptVariable,
            },
          ],
          type: "bgp",
        },
      ];
    }

    if (query.type === "SubjectsOfSemanticRelation") {
      return [
        // The semantic relations have a domain of skos:Concept, so no need to check the rdf:type
        {
          triples: [
            {
              subject: this.conceptVariable,
              predicate: query.semanticRelationProperty.identifier,
              object: query.objectConceptIdentifier,
            },
          ],
          type: "bgp",
        },
      ];
    }

    throw new RangeError("should never reach this code");
  }

  private async modelsByIdentifiers<ModelT>({
    identifiers,
    modelFactory,
  }: {
    identifiers: readonly Identifier[];
    modelFactory: ModelFactory<ModelT>;
  }): Promise<readonly Either<Resource.ValueError, ModelT>[]> {
    if (identifiers.length === 0) {
      return [];
    }

    const constructQueryString = modelFactory.sparqlConstructQueryString({
      prefixes,
      subject: this.modelVariable,
      where: [
        {
          values: identifiers.map((identifier) => {
            const valuePatternRow: sparqljs.ValuePatternRow = {};
            valuePatternRow[`?${this.modelVariable.value}`] = identifier;
            return valuePatternRow;
          }),
          type: "values",
        },
      ],
    });

    const quads = await this.sparqlQueryClient.queryQuads(constructQueryString);

    // const quadsString = quads.map((quad) => quad.toString()).join("\n");
    // console.log(quadsString);

    return identifiers.map((identifier) =>
      modelFactory.fromRdf({
        ignoreRdfType: true,
        languageIn: this.languageIn,
        resource: new Resource({
          dataset: this.datasetCoreFactory.dataset(quads.concat()),
          identifier,
        }),
      }),
    );
  }
}
