import { Identifier, LanguageTagSet, Model, abc } from "@kos-kit/models";
import {
  ConstructQueryBuilder,
  GraphPattern,
  ResourceGraphPatterns,
} from "@kos-kit/sparql-builder";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DatasetCoreFactory } from "@rdfjs/types";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { StubSequence } from "./StubSequence.js";

export class Stub<ModelT extends Model> extends abc.Stub<ModelT> {
  readonly identifier: Identifier;
  private readonly datasetCoreFactory: DatasetCoreFactory;
  private readonly graphPatterns: Iterable<GraphPattern>;
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly modelFromRdf: (
    resource: Resource<Identifier>,
  ) => Either<Error, ModelT>;
  private readonly modelVariable: GraphPattern.Variable;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    datasetCoreFactory,
    graphPatterns,
    identifier,
    includeLanguageTags,
    modelFromRdf,
    modelVariable,
    sparqlQueryClient,
    ...superParameters
  }: {
    datasetCoreFactory: DatasetCoreFactory;
    graphPatterns: Iterable<GraphPattern>;
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
    modelFromRdf: (resource: Resource<Identifier>) => Either<Error, ModelT>;
    modelVariable?: GraphPattern.Variable;
    sparqlQueryClient: SparqlQueryClient;
  } & ConstructorParameters<typeof abc.Stub>[0]) {
    super(superParameters);
    this.datasetCoreFactory = datasetCoreFactory;
    this.graphPatterns = graphPatterns;
    this.identifier = identifier;
    this.includeLanguageTags = includeLanguageTags;
    this.modelFromRdf = modelFromRdf;
    if (modelVariable) {
      this.modelVariable = modelVariable;
    } else if (
      graphPatterns instanceof ResourceGraphPatterns &&
      graphPatterns.subject.termType === "Variable"
    ) {
      this.modelVariable = graphPatterns.subject;
    } else {
      throw new Error("must specify a model variable");
    }
    this.sparqlQueryClient = sparqlQueryClient;
  }

  override cons(...tail: readonly Stub<ModelT>[]): StubSequence<ModelT> {
    return new StubSequence({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: this.graphPatterns,
      identifiers: [this.identifier, ...tail.map((stub) => stub.identifier)],
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFromRdf: this.modelFromRdf,
      modelVariable: this.modelVariable,
      stubFactory: (identifier) =>
        new Stub({
          datasetCoreFactory: this.datasetCoreFactory,
          graphPatterns: this.graphPatterns,
          includeLanguageTags: this.includeLanguageTags,
          identifier,
          logger: this.logger,
          modelFromRdf: this.modelFromRdf,
          modelVariable: this.modelVariable,
          sparqlQueryClient: this.sparqlQueryClient,
        }),
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  async resolve(): Promise<Either<this, ModelT>> {
    const quads = await this.sparqlQueryClient.queryQuads(
      new ConstructQueryBuilder({
        includeLanguageTags: [...this.includeLanguageTags],
      })
        .addGraphPatterns(this.graphPatterns)
        .addValues(this.modelVariable, this.identifier)
        .build(),
    );

    return this.modelFromRdf(
      new Resource({
        dataset: this.datasetCoreFactory.dataset(quads.concat()),
        identifier: this.identifier,
      }),
    ).mapLeft((error) => {
      this.logger.warn(
        "%s is missing, unable to resolve: %s",
        Identifier.toString(this.identifier),
        error.message,
      );
      return this;
    });
  }
}
