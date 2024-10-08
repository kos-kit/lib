import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Identifier,
  StubSequence,
} from "@kos-kit/models";
import * as rdfjsDataset from "@kos-kit/rdfjs-dataset-models";
import { BasicGraphPattern } from "@kos-kit/sparql-builder";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { GraphPatternStub } from "./GraphPatternStub.js";
import { GraphPatternStubSequence } from "./GraphPatternStubSequence.js";
import { Kos } from "./Kos.js";

class DefaultConcept extends rdfjsDataset.Concept<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {}

class DefaultConceptScheme extends rdfjsDataset.ConceptScheme<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {}

const DefaultLabel = rdfjsDataset.Label;
type DefaultLabel = rdfjsDataset.Label;

const conceptVariable = BasicGraphPattern.variable("concept");

const conceptGraphPatterns_ = [...new Concept.GraphPatterns(conceptVariable)];

const conceptSchemeVariable = BasicGraphPattern.variable("conceptScheme");

const conceptSchemeGraphPatterns_ = [
  ...new ConceptScheme.GraphPatterns(conceptSchemeVariable),
];

export class DefaultKos extends Kos<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  concept(identifier: Identifier): GraphPatternStub<DefaultConcept> {
    return new GraphPatternStub({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      modelVariable: conceptVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  conceptScheme(
    identifier: Identifier,
  ): GraphPatternStub<DefaultConceptScheme> {
    return new GraphPatternStub({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptSchemeGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptSchemeModelFactory(resource),
      modelVariable: conceptSchemeVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  async conceptSchemes(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<DefaultConceptScheme>> {
    return new GraphPatternStubSequence<DefaultConceptScheme>({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptSchemeGraphPatterns_,
      identifiers: await this.queryConceptSchemes(kwds),
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: (resource) => this.conceptSchemeModelFactory(resource),
      modelVariable: conceptVariable,
      logger: this.logger,
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.conceptScheme(identifier),
    });
  }

  async concepts(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<DefaultConcept>> {
    return new GraphPatternStubSequence<DefaultConcept>({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptGraphPatterns_,
      identifiers: await this.queryConcepts(kwds),
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      modelVariable: conceptVariable,
      logger: this.logger,
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.concept(identifier),
    });
  }

  private conceptModelFactory(
    resource: Resource<Identifier>,
  ): Maybe<DefaultConcept> {
    if (resource.isInstanceOf(skos.Concept)) {
      return Maybe.of(
        new DefaultConcept({
          kos: this,
          labelConstructor: DefaultLabel,
          logger: this.logger,
          resource,
        }),
      );
    }
    return Maybe.empty();
  }

  private conceptSchemeModelFactory(
    resource: Resource<Identifier>,
  ): Maybe<DefaultConceptScheme> {
    if (resource.isInstanceOf(skos.ConceptScheme)) {
      return Maybe.of(
        new DefaultConceptScheme({
          kos: this,
          labelConstructor: DefaultLabel,
          logger: this.logger,
          resource,
        }),
      );
    }
    return Maybe.empty();
  }
}
