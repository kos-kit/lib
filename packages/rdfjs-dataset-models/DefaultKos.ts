import { Identifier } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Label } from "./Label.js";
import { Stub } from "./Stub.js";

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
  concept(identifier: Identifier): Stub<DefaultConcept> {
    return new Stub({
      dataset: this.dataset,
      identifier,
      logger: this.logger,
      modelFactory: (identifier) =>
        new DefaultConcept({
          dataset: this.dataset,
          identifier,
          kos: this,
          labelConstructor: Label,
          logger: this.logger,
        }),
      modelRdfType: skos.Concept,
    });
  }

  conceptScheme(identifier: Identifier): Stub<DefaultConceptScheme> {
    return new Stub({
      dataset: this.dataset,
      identifier,
      logger: this.logger,
      modelFactory: (identifier) =>
        new DefaultConceptScheme({
          dataset: this.dataset,
          identifier,
          kos: this,
          labelConstructor: Label,
          logger: this.logger,
        }),
      modelRdfType: skos.ConceptScheme,
    });
  }
}
