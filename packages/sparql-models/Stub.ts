import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { SparqlQueryClient } from "@kos-kit/sparql-client";
import { DatasetCore } from "@rdfjs/types";

export abstract class Stub<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
  ModelT extends ConceptT | ConceptSchemeT,
> extends abc.Stub<ConceptT, ConceptSchemeT, LabelT, ModelT> {
  protected readonly modelFactory: (_: {
    dataset: DatasetCore;
    identifier: Identifier;
  }) => ModelT;
  protected readonly sparqlQueryClient: SparqlQueryClient;

  constructor({
    modelFactory,
    sparqlQueryClient,
    ...superParameters
  }: Stub.Parameters<ConceptT, ConceptSchemeT, LabelT, ModelT>) {
    super(superParameters);
    this.modelFactory = modelFactory;
    this.sparqlQueryClient = sparqlQueryClient;
  }
}

export namespace Stub {
  export interface Parameters<
    ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
    ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
    LabelT extends ILabel,
    ModelT extends ConceptT | ConceptSchemeT,
  > extends abc.Stub.Parameters<ConceptT, ConceptSchemeT, LabelT> {
    modelFactory: (_: {
      dataset: DatasetCore;
      identifier: Identifier;
    }) => ModelT;
    sparqlQueryClient: SparqlQueryClient;
  }
}
