import { Identifier, LanguageTagSet, NamedModel, abc } from "@kos-kit/models";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DatasetCoreFactory } from "@rdfjs/types";
import { Either, Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import { GraphPattern, GraphPatternVariable } from "./GraphPattern.js";

export class GraphPatternStub<
  ModelT extends NamedModel,
> extends abc.Stub<ModelT> {
  readonly identifier: Identifier;

  private readonly datasetCoreFactory: DatasetCoreFactory;
  private readonly graphPatterns: readonly GraphPattern[];
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Maybe<ModelT>;
  private readonly modelVariable: GraphPatternVariable;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    datasetCoreFactory,
    graphPatterns,
    identifier,
    includeLanguageTags,
    modelFactory,
    modelVariable,
    sparqlQueryClient,
    ...superParameters
  }: {
    datasetCoreFactory: DatasetCoreFactory;
    graphPatterns: readonly GraphPattern[];
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
    modelFactory: (resource: Resource<Identifier>) => Maybe<ModelT>;
    modelVariable: GraphPatternVariable;
    sparqlQueryClient: SparqlQueryClient;
  } & abc.Stub.Parameters) {
    super(superParameters);
    this.datasetCoreFactory = datasetCoreFactory;
    this.graphPatterns = graphPatterns;
    this.identifier = identifier;
    this.includeLanguageTags = includeLanguageTags;
    this.modelFactory = modelFactory;
    this.modelVariable = modelVariable;
    this.sparqlQueryClient = sparqlQueryClient;
  }

  async resolve(): Promise<Either<this, ModelT>> {
    const quads = await this.sparqlQueryClient.queryQuads(
      new ConstructQueryBuilder({
        includeLanguageTags: this.includeLanguageTags,
      })
        .addGraphPatterns(...this.graphPatterns)
        .addValues(this.modelVariable, this.identifier)
        .build(),
    );

    return this.modelFactory(
      new Resource({
        dataset: this.datasetCoreFactory.dataset(quads.concat()),
        identifier: this.identifier,
      }),
    )
      .toEither(this)
      .ifLeft(() => {
        this.logger.warn(
          "%s is missing, unable to resolve",
          Identifier.toString(this.identifier),
        );
      });
  }
}
