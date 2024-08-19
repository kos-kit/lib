import { Identifier } from "@kos-kit/models";
import { Concept, ConceptScheme, Label } from "@kos-kit/rdfjs-dataset-models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { GraphPatternVariable } from "./GraphPattern.js";
import { Kos } from "./Kos.js";
import { Stub } from "./Stub.js";
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

export class DefaultKos extends Kos<
  DefaultConcept,
  DefaultConceptScheme,
  DefaultLabel
> {
  concept(
    identifier: Identifier,
  ): Stub<DefaultConcept, DefaultConceptScheme, DefaultLabel, DefaultConcept> {
    const conceptVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "concept",
    };
    return new Stub({
      graphPatterns: conceptGraphPatterns({
        subject: conceptVariable,
        variablePrefix: conceptVariable.value,
      }),
      identifier,
      kos: this,
      logger: this.logger,
      modelFactory: (resource) => {
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
      },
      modelVariable: conceptVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }

  conceptScheme(
    identifier: Identifier,
  ): Stub<
    DefaultConcept,
    DefaultConceptScheme,
    DefaultLabel,
    DefaultConceptScheme
  > {
    const conceptSchemeVariable: GraphPatternVariable = {
      termType: "Variable",
      value: "conceptScheme",
    };

    return new Stub({
      graphPatterns: conceptSchemeGraphPatterns({
        subject: conceptSchemeVariable,
        variablePrefix: conceptSchemeVariable.value,
      }),
      identifier,
      kos: this,
      logger: this.logger,
      modelFactory: (resource) => {
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
      },
      modelVariable: conceptSchemeVariable,
      sparqlQueryClient: this.sparqlQueryClient,
    });
  }
}
