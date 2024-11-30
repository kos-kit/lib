import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Identifier,
} from "@kos-kit/models";
import * as rdfjsDataset from "@kos-kit/rdfjs-dataset-models";
import { GraphPattern } from "@kos-kit/sparql-builder";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Either, Left, Right } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";

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

const conceptGraphPatterns_ = new Concept.GraphPatterns(
  GraphPattern.variable("concept"),
);

const conceptSchemeGraphPatterns_ = new ConceptScheme.GraphPatterns(
  GraphPattern.variable("conceptScheme"),
);

export class DefaultKos extends Kos<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  override concept(identifier: Identifier): Stub<DefaultConcept> {
    return new Stub({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  override conceptScheme(identifier: Identifier): Stub<DefaultConceptScheme> {
    return new Stub({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptSchemeGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptSchemeModelFactory(resource),
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  override conceptSchemesByIdentifiers(
    identifiers: readonly Identifier[],
  ): StubSequence<DefaultConceptScheme> {
    return new StubSequence<DefaultConceptScheme>({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptSchemeGraphPatterns_,
      identifiers,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptSchemeModelFactory(resource),
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.conceptScheme(identifier),
    });
  }

  async conceptSchemesByQuery(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<DefaultConceptScheme>> {
    return new StubSequence<DefaultConceptScheme>({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptSchemeGraphPatterns_,
      identifiers: await this.queryConceptSchemes(kwds),
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: (resource) => this.conceptSchemeModelFactory(resource),
      logger: this.logger,
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.conceptScheme(identifier),
    });
  }

  override conceptsByIdentifiers(
    identifiers: readonly Identifier[],
  ): StubSequence<DefaultConcept> {
    return new StubSequence<DefaultConcept>({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptGraphPatterns_,
      identifiers,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.concept(identifier),
    });
  }

  async conceptsByQuery(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<DefaultConcept>> {
    return new StubSequence<DefaultConcept>({
      datasetCoreFactory: this.datasetCoreFactory,
      graphPatterns: conceptGraphPatterns_,
      identifiers: await this.queryConcepts(kwds),
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      logger: this.logger,
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.concept(identifier),
    });
  }

  private conceptModelFactory(
    resource: Resource<Identifier>,
  ): Either<Error, DefaultConcept> {
    if (resource.isInstanceOf(skos.Concept)) {
      return Right(
        new DefaultConcept({
          kos: this,
          labelConstructor: DefaultLabel,
          logger: this.logger,
          resource,
        }),
      );
    }
    return Left(
      new Error(
        `${Resource.Identifier.toString(resource.identifier)} is not a skos:Concept`,
      ),
    );
  }

  private conceptSchemeModelFactory(
    resource: Resource<Identifier>,
  ): Either<Error, DefaultConceptScheme> {
    if (resource.isInstanceOf(skos.ConceptScheme)) {
      return Right(
        new DefaultConceptScheme({
          kos: this,
          labelConstructor: DefaultLabel,
          logger: this.logger,
          resource,
        }),
      );
    }
    return Left(
      new Error(
        `${Resource.Identifier.toString(resource.identifier)} is not a skos:ConceptScheme`,
      ),
    );
  }
}
