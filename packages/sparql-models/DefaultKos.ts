import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Identifier,
  StubSequence,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Concept, ConceptScheme, Label } from "@kos-kit/rdfjs-dataset-models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { GraphPatternVariable } from "./GraphPattern.js";
import { GraphPatternStub } from "./GraphPatternStub.js";
import { GraphPatternStubSequence } from "./GraphPatternStubSequence.js";
import { Kos } from "./Kos.js";
import { conceptGraphPatterns } from "./conceptGraphPatterns.js";
import { conceptSchemeGraphPatterns } from "./conceptSchemeGraphPatterns.js";

class DefaultConcept extends Concept<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {}

class DefaultConceptScheme extends ConceptScheme<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {}

type DefaultLabel = Label;

const conceptVariable: GraphPatternVariable = {
  termType: "Variable",
  value: "concept",
};

const conceptGraphPatterns_ = conceptGraphPatterns({
  subject: conceptVariable,
  variablePrefix: conceptVariable.value,
});

const conceptSchemeVariable: GraphPatternVariable = {
  termType: "Variable",
  value: "conceptScheme",
};

const conceptSchemeGraphPatterns_ = conceptSchemeGraphPatterns({
  subject: conceptSchemeVariable,
  variablePrefix: conceptSchemeVariable.value,
});

export class DefaultKos extends Kos<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  concept(identifier: Identifier): GraphPatternStub<DefaultConcept> {
    return new GraphPatternStub({
      graphPatterns: conceptGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      modelVariable: conceptVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  async concepts(kwds: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<DefaultConcept>> {
    return new GraphPatternStubSequence({
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

  conceptScheme(
    identifier: Identifier,
  ): GraphPatternStub<DefaultConceptScheme> {
    return new GraphPatternStub({
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
    return new GraphPatternStubSequence({
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

  private conceptModelFactory(
    resource: Resource<Identifier>,
  ): Maybe<DefaultConcept> {
    if (resource.isInstanceOf(skos.Concept)) {
      return Maybe.of(
        new DefaultConcept({
          kos: this,
          labelConstructor: Label,
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
          labelConstructor: Label,
          logger: this.logger,
          resource,
        }),
      );
    }
    return Maybe.empty();
  }
}
