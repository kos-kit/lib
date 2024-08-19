import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { Maybe } from "purify-ts";
import { ConstructQueryBuilder } from "./ConstructQueryBuilder.js";
import { GraphPattern, GraphPatternVariable } from "./GraphPattern.js";

export class Stub<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
  ModelT extends ConceptT | ConceptSchemeT,
> extends abc.Stub<ConceptT, ConceptSchemeT, LabelT, ModelT> {
  private readonly graphPatterns: readonly GraphPattern[];
  private readonly modelFactory: (
    resource: Resource<Identifier>,
  ) => Maybe<ModelT>;
  private readonly modelVariable: GraphPatternVariable;
  private readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    graphPatterns,
    modelFactory,
    modelVariable,
    sparqlQueryClient,
    ...superParameters
  }: {
    graphPatterns: readonly GraphPattern[];
    modelFactory: (resource: Resource<Identifier>) => Maybe<ModelT>;
    modelVariable: GraphPatternVariable;
    sparqlQueryClient: SparqlQueryClient;
  } & abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(superParameters);
    this.graphPatterns = graphPatterns;
    this.modelFactory = modelFactory;
    this.modelVariable = modelVariable;
    this.sparqlQueryClient = sparqlQueryClient;
  }

  async resolve(): Promise<Maybe<ModelT>> {
    const dataset = await this.sparqlQueryClient.queryDataset(
      new ConstructQueryBuilder({
        includeLanguageTags: this.kos.includeLanguageTags,
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
