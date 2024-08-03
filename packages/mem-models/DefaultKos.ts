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
  conceptByIdentifier(
    identifier: Identifier,
  ): Stub<DefaultConcept, DefaultConceptScheme, DefaultLabel, DefaultConcept> {
    return new Stub({
      dataset: this.dataset,
      identifier,
      labelConstructor: Label,
      modelConstructor: DefaultConcept,
      modelRdfType: skos.Concept,
      kos: this,
    });
  }

  conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Stub<
    DefaultConcept,
    DefaultConceptScheme,
    DefaultLabel,
    DefaultConceptScheme
  > {
    return new Stub({
      dataset: this.dataset,
      identifier,
      labelConstructor: Label,
      modelConstructor: DefaultConceptScheme,
      modelRdfType: skos.ConceptScheme,
      kos: this,
    });
  }
}
