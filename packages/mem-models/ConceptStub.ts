import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Stub } from "./Stub.js";
import { Just, Maybe, Nothing } from "purify-ts";
import { skos } from "@tpluscode/rdf-ns-builders";

export class ConceptStub<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> extends Stub<ConceptT, ConceptSchemeT, LabelT, ConceptT> {
  async resolve(): Promise<Maybe<ConceptT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    // TODO: fetch all required fields here
    if (this.resource.isInstanceOf(skos.Concept)) {
      return Just(this.modelFactory.createConcept(this.resource));
    }
    return Nothing;
  }
}
