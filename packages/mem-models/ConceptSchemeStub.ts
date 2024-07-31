import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Just, Maybe, Nothing } from "purify-ts";
import { Stub } from "./Stub.js";

export class ConceptSchemeStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends Stub<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT> {
  async resolve(): Promise<Maybe<ConceptSchemeT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    // TODO: fetch all required fields here
    if (this.resource.isInstanceOf(skos.ConceptScheme)) {
      return Just(this.modelFactory.createConceptScheme(this.resource));
    }
    return Nothing;
  }
}
