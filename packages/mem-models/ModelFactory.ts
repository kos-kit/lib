import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Label } from "./Label.js";

export class ModelFactory {
  createConcept({
    identifier,
    kos,
  }: {
    identifier: BlankNode | NamedNode;
    kos: Kos;
  }): Concept {
    return new Concept({ identifier, kos });
  }

  createConceptScheme({
    identifier,
    kos,
  }: {
    identifier: BlankNode | NamedNode;
    kos: Kos;
  }): ConceptScheme {
    return new ConceptScheme({ identifier, kos });
  }

  createLabel({
    identifier,
    kos,
    literalForm,
  }: {
    identifier: BlankNode | NamedNode;
    kos: Kos;
    literalForm: Literal;
  }): Label {
    return new Label({ identifier, kos, literalForm });
  }
}
