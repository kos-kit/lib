import { Identifier } from "@kos-kit/models";
import { Concept, ConceptScheme, Label } from "@kos-kit/rdfjs-dataset-models";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { Kos } from "./Kos.js";
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
    return new ConceptStub({
      identifier,
      kos: this,
      modelFactory: ({ dataset, identifier }) =>
        new DefaultConcept({
          dataset,
          identifier,
          kos: this,
          labelConstructor: Label,
        }),
      sparqlClient: this.sparqlClient,
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
    return new ConceptSchemeStub({
      identifier,
      kos: this,
      modelFactory: ({ dataset, identifier }) =>
        new DefaultConceptScheme({
          dataset,
          identifier,
          kos: this,
          labelConstructor: Label,
        }),
      sparqlClient: this.sparqlClient,
    });
  }
}
