import {
  Identifier,
  LanguageTagSet,
  NamedModel,
  Stub,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { Logger } from "pino";
import { Maybe } from "purify-ts";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import { GraphPattern, GraphPatternVariable } from "./GraphPattern.js";

export class StubSequence<
  ModelT extends NamedModel,
> extends abc.StubSequence<ModelT> {
  private readonly graphPatterns: readonly GraphPattern[];
  private readonly identifiers: readonly Identifier[];
  private readonly includeLanguageTags: LanguageTagSet;
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Maybe<ModelT>;
  private readonly logger: Logger;
  private readonly stubFactory: (identifier: Identifier) => Stub<ModelT>;
  private readonly modelVariable: GraphPatternVariable;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    graphPatterns,
    includeLanguageTags,
    identifiers,
    logger,
    modelFactory,
    modelVariable,
    sparqlQueryClient,
    stubFactory,
  }: {
    graphPatterns: readonly GraphPattern[];
    identifiers: readonly Identifier[];
    includeLanguageTags: LanguageTagSet;
    logger: Logger;
    modelFactory: (resource: Resource<Identifier>) => Maybe<ModelT>;
    modelVariable: GraphPatternVariable;
    sparqlQueryClient: SparqlQueryClient;
    stubFactory: (identifier: Identifier) => Stub<ModelT>;
  }) {
    super();
    this.graphPatterns = graphPatterns;
    this.identifiers = identifiers;
    this.includeLanguageTags = includeLanguageTags;
    this.logger = logger;
    this.modelFactory = modelFactory;
    this.modelVariable = modelVariable;
    this.sparqlQueryClient = sparqlQueryClient;
    this.stubFactory = stubFactory;
  }

  get length(): number {
    return this.identifiers.length;
  }

  override at(index: number): Stub<ModelT> | undefined {
    const identifier = this.identifiers[index];
    if (typeof identifier === "undefined") {
      return undefined;
    }
    return this.stubFactory(identifier);
  }

  async resolve(): Promise<readonly Maybe<ModelT>[]> {
    const dataset = await this.sparqlQueryClient.queryDataset(
      new ConstructQueryBuilder({
        includeLanguageTags: this.includeLanguageTags,
      })
        .addGraphPatterns(...this.graphPatterns)
        .addValues(this.modelVariable, ...this.identifiers)
        .build(),
    );

    const modelMaybes: Maybe<ModelT>[] = [];
    for (const identifier of this.identifiers) {
      const resource = new Resource({ dataset, identifier });
      const modelMaybe = this.modelFactory(resource);
      if (modelMaybe.isNothing()) {
        this.logger.warn(
          "%s is missing, unable to resolve",
          Identifier.toString(identifier),
        );
      }
      modelMaybes.push(modelMaybe);
    }
    return modelMaybes;
  }

  [Symbol.iterator](): Iterator<Stub<ModelT>> {
    return this.identifiers
      .map((identifier) => this.stubFactory(identifier))
      [Symbol.iterator]();
  }
}
