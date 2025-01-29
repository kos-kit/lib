import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DataFactory, DatasetCoreFactory, Quad, Variable } from "@rdfjs/types";
import { dcterms, rdf, rdfs, skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { Either, EitherAsync, Left } from "purify-ts";
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
  protected readonly languageIn: readonly LanguageTag[];
  private readonly modelFactories: ModelFactories<
    ConceptT,
    ConceptSchemeT,
    ConceptSchemeStubT,
    ConceptStubT
  >;
  private readonly modelVariable: Variable;
  protected readonly sparqlGenerator: sparqljs.SparqlGenerator;
  protected readonly sparqlQueryClient: SparqlQueryClient;

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
    query: ConceptQuery;
  }): Promise<Either<Error, readonly Identifier[]>> {
    return EitherAsync(async () =>
      mapBindingsToIdentifiers(
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
            where: this.conceptQueryToWherePatterns(query).concat(),
          }),
        ),
        this.conceptVariable.value,
      ),
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
    query: ConceptSchemeQuery;
  }): Promise<Either<Error, readonly Identifier[]>> {
    return EitherAsync(async () =>
      mapBindingsToIdentifiers(
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
            where: this.conceptSchemeQueryToWherePatterns(query).concat(),
          }),
        ),
        this.conceptSchemeVariable.value,
      ),
    );
  }

  async conceptSchemeStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeStubT>> {
    return this.modelByIdentifier({
      identifier,
      modelFactory: this.modelFactories.conceptSchemeStub,
    });
  }

  async conceptSchemeStubs(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<Either<Error, readonly ConceptSchemeStubT[]>> {
    const identifiersEither = await this.conceptSchemeIdentifiers(parameters);
    if (identifiersEither.isLeft()) {
      return identifiersEither;
    }
    const identifiers = identifiersEither.unsafeCoerce();
    const modelEithers = await this.modelsByIdentifiers({
      identifiers: identifiers,
      modelFactory: this.modelFactories.conceptSchemeStub,
    });
    if (modelEithers.length !== identifiers.length) {
      throw new Error("should never happen");
    }
    return Either.of(
      modelEithers.map(
        (modelEither, index) =>
          modelEither
            .mapLeft(() =>
              this.modelFactories.conceptSchemeStub.fromIdentifier(
                identifiers[index],
              ),
            )
            .extract()!,
      ),
    );
  }

  async conceptSchemesCount(
    query: ConceptSchemeQuery,
  ): Promise<Either<Error, number>> {
    return EitherAsync(async ({ liftEither }) =>
      liftEither(
        mapBindingsToCount(
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
              where: this.conceptSchemeQueryToWherePatterns(query).concat(),
            }),
          ),
          this.countVariable.value,
        ),
      ),
    );
  }

  async conceptStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptStubT>> {
    return this.modelByIdentifier({
      identifier,
      modelFactory: this.modelFactories.conceptStub,
    });
  }

  async conceptStubs(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<Either<Error, readonly ConceptStubT[]>> {
    const identifiersEither = await this.conceptIdentifiers(parameters);
    if (identifiersEither.isLeft()) {
      return identifiersEither;
    }
    const identifiers = identifiersEither.unsafeCoerce();
    const modelEithers = await this.modelsByIdentifiers({
      identifiers: identifiers,
      modelFactory: this.modelFactories.conceptStub,
    });
    if (modelEithers.length !== identifiers.length) {
      throw new Error("should never happen");
    }
    return Either.of(
      modelEithers.map(
        (modelEither, index) =>
          modelEither
            .mapLeft(() =>
              this.modelFactories.conceptStub.fromIdentifier(
                identifiers[index],
              ),
            )
            .extract()!,
      ),
    );
  }

  async conceptsCount(query: ConceptQuery): Promise<Either<Error, number>> {
    return EitherAsync(async ({ liftEither }) =>
      liftEither(
        mapBindingsToCount(
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
              where: this.conceptQueryToWherePatterns(query).concat(),
            }),
          ),
          this.countVariable.value,
        ),
      ),
    );
  }

  private conceptQueryToWherePatterns(
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

    if (query.type === "Identifiers") {
      return [
        {
          values: query.conceptIdentifiers.map((identifier) => {
            const valuePatternRow: sparqljs.ValuePatternRow = {};
            valuePatternRow[`?${this.conceptVariable.value}`] = identifier;
            return valuePatternRow;
          }),
          type: "values",
        },
        sparqlRdfTypePattern({
          rdfType: skos.Concept,
          subject: this.conceptVariable,
        }),
      ];
    }

    if (query.type === "InScheme" || query.type === "TopConceptOf") {
      const patterns: sparqljs.Pattern[] = [];

      const unionPatterns: sparqljs.Pattern[] = [];

      if (query.type === "InScheme") {
        if (query.conceptIdentifier) {
          patterns.push({
            values: [query.conceptIdentifier].map((identifier) => {
              const valuePatternRow: sparqljs.ValuePatternRow = {};
              valuePatternRow[`?${this.conceptVariable.value}`] = identifier;
              return valuePatternRow;
            }),
            type: "values",
          });

          unionPatterns.push({
            triples: [
              {
                subject: this.conceptVariable,
                predicate: skos.inScheme,
                object: query.conceptSchemeIdentifier,
              },
            ],
            type: "bgp",
          });
        } else {
          // skos:inScheme has an open domain, so we have to check the concept's rdf:type
          unionPatterns.push({
            patterns: [
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
                rdfType: skos.Concept,
              }),
            ],
            type: "group",
          });
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

      patterns.push({ patterns: unionPatterns, type: "union" });
      return patterns;
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

  private conceptSchemeQueryToWherePatterns(
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

  protected async modelByIdentifier<ModelT>({
    identifier,
    modelFactory,
  }: {
    identifier: Identifier;
    modelFactory: ModelFactory<ModelT>;
  }): Promise<Either<Error, ModelT>> {
    return (
      await this.modelsByIdentifiers({
        identifiers: [identifier],
        modelFactory,
      })
    )[0];
  }

  protected async modelsByIdentifiers<ModelT>({
    identifiers,
    modelFactory,
  }: {
    identifiers: readonly Identifier[];
    modelFactory: ModelFactory<ModelT>;
  }): Promise<readonly Either<Error, ModelT>[]> {
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

    let quads: readonly Quad[];
    try {
      quads = await this.sparqlQueryClient.queryQuads(constructQueryString);
    } catch (e) {
      const left = Left<Error, ModelT>(e as Error);
      return identifiers.map(() => left);
    }

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
