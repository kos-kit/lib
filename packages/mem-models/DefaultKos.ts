import { Identifier } from "@kos-kit/models";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { Kos } from "./Kos.js";
import { Label } from "./Label.js";

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
  ): ConceptStub<DefaultConcept, DefaultConceptScheme, DefaultLabel> {
    return new ConceptStub({
      conceptConstructor: DefaultConcept,
      dataset: this.dataset,
      identifier,
      labelConstructor: Label,
      kos: this,
    });
  }

  conceptSchemeByIdentifier(
    identifier: Identifier,
  ): ConceptSchemeStub<DefaultConcept, DefaultConceptScheme, DefaultLabel> {
    return new ConceptSchemeStub({
      conceptSchemeConstructor: DefaultConceptScheme,
      dataset: this.dataset,
      identifier,
      labelConstructor: Label,
      kos: this,
    });
  }
}
