import { Identifier } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Concept, ConceptScheme, Label } from "@kos-kit/rdfjs-dataset-models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { GraphPatternVariable } from "./GraphPattern.js";
import { Kos } from "./Kos.js";
import { Stub } from "./Stub.js";
import { StubSequence } from "./StubSequence.js";
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
  concept(identifier: Identifier): Stub<DefaultConcept> {
    return new Stub({
      graphPatterns: conceptGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      modelVariable: conceptVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  conceptScheme(identifier: Identifier): Stub<DefaultConceptScheme> {
    return new Stub({
      graphPatterns: conceptSchemeGraphPatterns_,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      logger: this.logger,
      modelFactory: (resource) => this.conceptSchemeModelFactory(resource),
      modelVariable: conceptSchemeVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  protected override conceptsStubSequence(
    identifiers: readonly Identifier[],
  ): StubSequence<DefaultConcept> {
    return new StubSequence({
      graphPatterns: conceptGraphPatterns_,
      identifiers,
      includeLanguageTags: this.includeLanguageTags,
      modelFactory: (resource) => this.conceptModelFactory(resource),
      modelVariable: conceptVariable,
      logger: this.logger,
      sparqlQueryClient: this.sparqlQueryClient,
      stubFactory: (identifier) => this.concept(identifier),
    });
  }

  protected override conceptSchemesStubSequence(
    identifiers: readonly Identifier[],
  ): StubSequence<DefaultConceptScheme> {
    return new StubSequence({
      graphPatterns: conceptSchemeGraphPatterns_,
      identifiers,
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
          dataset: resource.dataset,
          identifier: resource.identifier,
          kos: this,
          labelConstructor: Label,
          logger: this.logger,
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
          dataset: resource.dataset,
          identifier: resource.identifier,
          kos: this,
          labelConstructor: Label,
          logger: this.logger,
        }),
      );
    }
    return Maybe.empty();
  }
}
