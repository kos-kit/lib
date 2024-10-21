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

export class Stub<ModelT extends Model> extends abc.Stub<ModelT> {
  readonly identifier: Identifier;

  private readonly datasetCoreFactory: DatasetCoreFactory;
  private readonly graphPatterns: Iterable<GraphPattern>;
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Either<Error, ModelT>;
  private readonly modelVariable: GraphPattern.Variable;
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
    graphPatterns: Iterable<GraphPattern>;
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
    modelFactory: (resource: Resource<Identifier>) => Either<Error, ModelT>;
    modelVariable?: GraphPattern.Variable;
    sparqlQueryClient: SparqlQueryClient;
  } & abc.Stub.Parameters) {
    super(superParameters);
    this.datasetCoreFactory = datasetCoreFactory;
    this.graphPatterns = graphPatterns;
    this.identifier = identifier;
    this.includeLanguageTags = includeLanguageTags;
    this.modelFactory = modelFactory;
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

  async resolve(): Promise<Either<this, ModelT>> {
    const quads = await this.sparqlQueryClient.queryQuads(
      new ConstructQueryBuilder({
        includeLanguageTags: [...this.includeLanguageTags],
      })
        .addGraphPatterns(this.graphPatterns)
        .addValues(this.modelVariable, this.identifier)
        .build(),
    );

    return this.modelFactory(
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
