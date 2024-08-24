import { Identifier, LanguageTagSet, NamedModel, abc } from "@kos-kit/models";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import { GraphPattern, GraphPatternVariable } from "./GraphPattern.js";

export class GraphPatternStub<
  ModelT extends NamedModel,
> extends abc.Stub<ModelT> {
  readonly identifier: Identifier;

  private readonly graphPatterns: readonly GraphPattern[];
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Maybe<ModelT>;
  private readonly modelVariable: GraphPatternVariable;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    graphPatterns,
    identifier,
    includeLanguageTags,
    modelFactory,
    modelVariable,
    sparqlQueryClient,
    ...superParameters
  }: {
    graphPatterns: readonly GraphPattern[];
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
    modelFactory: (resource: Resource<Identifier>) => Maybe<ModelT>;
    modelVariable: GraphPatternVariable;
    sparqlQueryClient: SparqlQueryClient;
  } & abc.Stub.Parameters) {
    super(superParameters);
    this.graphPatterns = graphPatterns;
    this.identifier = identifier;
    this.includeLanguageTags = includeLanguageTags;
    this.modelFactory = modelFactory;
    this.modelVariable = modelVariable;
    this.sparqlQueryClient = sparqlQueryClient;
  }

  async resolve(): Promise<Maybe<ModelT>> {
    const dataset = await this.sparqlQueryClient.queryDataset(
      new ConstructQueryBuilder({
        includeLanguageTags: this.includeLanguageTags,
      })
        .addGraphPatterns(...this.graphPatterns)
        .addValues(this.modelVariable, this.identifier)
        .build(),
    );

    const resource = new Resource({ dataset, identifier: this.identifier });
    const model = this.modelFactory(resource);
    if (model.isNothing()) {
      this.logger.warn(
        "%s is missing, unable to resolve",
        Identifier.toString(this.identifier),
      );
    }
    return model;
  }
}
