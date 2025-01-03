import { Identifier, LanguageTagSet, Model, Stub, abc } from "@kos-kit/models";
import {
  ConstructQueryBuilder,
  GraphPattern,
  ResourceGraphPatterns,
} from "@kos-kit/sparql-builder";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DatasetCoreFactory } from "@rdfjs/types";
import { Logger } from "pino";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";

export class StubSequence<
  ModelT extends Model,
> extends abc.StubSequence<ModelT> {
  private readonly datasetCoreFactory: DatasetCoreFactory;
  private readonly graphPatterns: Iterable<GraphPattern>;
  private readonly identifiers: readonly Identifier[];
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly logger: Logger;
  private readonly modelFromRdf: (
    resource: Resource<Identifier>,
  ) => Either<Error, ModelT>;
  private readonly modelVariable: GraphPattern.Variable;
  private readonly sparqlQueryClient: SparqlQueryClient;
  private readonly stubFactory: (identifier: Identifier) => Stub<ModelT>;

  constructor({
    datasetCoreFactory,
    graphPatterns,
    includeLanguageTags,
    identifiers,
    logger,
    modelFromRdf,
    modelVariable,
    sparqlQueryClient,
    stubFactory,
  }: {
    datasetCoreFactory: DatasetCoreFactory;
    graphPatterns: Iterable<GraphPattern>;
    identifiers: readonly Identifier[];
    includeLanguageTags: LanguageTagSet;
    logger: Logger;
    modelFromRdf: (resource: Resource<Identifier>) => Either<Error, ModelT>;
    modelVariable?: GraphPattern.Variable;
    sparqlQueryClient: SparqlQueryClient;
    stubFactory: (identifier: Identifier) => Stub<ModelT>;
  }) {
    super();
    this.datasetCoreFactory = datasetCoreFactory;
    this.graphPatterns = [...graphPatterns];
    this.identifiers = identifiers;
    this.includeLanguageTags = includeLanguageTags;
    this.logger = logger;
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
    this.stubFactory = stubFactory;
  }

  get length(): number {
    return this.identifiers.length;
  }

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return this.identifiers
      .map((identifier) => this.stubFactory(identifier))
      [Symbol.iterator]();
  }

  override at(index: number): Stub<ModelT> | undefined {
    const identifier = this.identifiers[index];
    if (typeof identifier === "undefined") {
      return undefined;
    }
    return this.stubFactory(identifier);
  }

  async resolve(): Promise<readonly Either<Stub<ModelT>, ModelT>[]> {
    const quads = await this.sparqlQueryClient.queryQuads(
      new ConstructQueryBuilder({
        includeLanguageTags: [...this.includeLanguageTags],
      })
        .addGraphPatterns(this.graphPatterns)
        .addValues(this.modelVariable, ...this.identifiers)
        .build(),
    );

    return this.identifiers.map((identifier, identifierI) =>
      this.modelFromRdf(
        new Resource({
          dataset: this.datasetCoreFactory.dataset(quads.concat()),
          identifier,
        }),
      ).mapLeft((error) => {
        this.logger.warn(
          "%s is missing, unable to resolve: %s",
          Identifier.toString(identifier),
          error.message,
        );
        return this.at(identifierI)!;
      }),
    );
  }
}
