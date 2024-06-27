import * as mem from "@kos-kit/mem-models";
import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { GraphPatternVariable } from "./GraphPattern.js";
import { LabeledModel } from "./LabeledModel.js";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";

export class DefaultModelFetcher<
  MemConceptT extends IConcept,
  MemConceptSchemeT extends IConceptScheme,
  MemLabelT extends ILabel,
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> implements ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>
{
  private readonly conceptConstructor: new (
    parameters: LabeledModel.Parameters<
      MemConceptT,
      SparqlConceptT,
      SparqlConceptSchemeT
    >,
  ) => SparqlConceptT;

  private readonly conceptSchemeConstructor: new (
    parameters: LabeledModel.Parameters<
      MemConceptSchemeT,
      SparqlConceptT,
      SparqlConceptSchemeT
    >,
  ) => SparqlConceptSchemeT;

  private readonly memModelFactory: mem.ModelFactory<
    MemConceptT,
    MemConceptSchemeT,
    MemLabelT
  >;

  private readonly sparqlClient: SparqlClient;

  constructor({
    conceptConstructor,
    conceptSchemeConstructor,
    memModelFactory,
    sparqlClient,
  }: {
    conceptConstructor: new (
      parameters: LabeledModel.Parameters<
        MemConceptT,
        SparqlConceptT,
        SparqlConceptSchemeT
      >,
    ) => SparqlConceptT;
    conceptSchemeConstructor: new (
      parameters: LabeledModel.Parameters<
        MemConceptSchemeT,
        SparqlConceptT,
        SparqlConceptSchemeT
      >,
    ) => SparqlConceptSchemeT;
    memModelFactory: mem.ModelFactory<
      MemConceptT,
      MemConceptSchemeT,
      MemLabelT
    >;
    sparqlClient: SparqlClient;
  }) {
    this.conceptConstructor = conceptConstructor;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.memModelFactory = memModelFactory;
    this.sparqlClient = sparqlClient;
  }

  fetchConceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly SparqlConceptT[]> {}

  async fetchConceptSchemesByIdentifier(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly SparqlConceptSchemeT[]> {
    const conceptSchemeVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "conceptScheme",
    };
    const includeLanguageTags = this.includeLanguageTags;
    const dataset = await this.sparqlClient.query.construct(
      new ConstructQueryBuilder({
        includeLanguageTags,
      })
        .addGraphPatterns(
          ...ConceptScheme.propertyGraphPatterns({
            subject: conceptSchemeVariable,
            variablePrefix: conceptSchemeVariable.value,
          }),
        )
        .addValues(conceptSchemeVariable, ...identifiers)
        .build(),
      { operation: "postDirect" },
    );
    return identifiers.map((identifier) =>
      this.createConceptScheme({ dataset, identifier }),
    );
  }
}
