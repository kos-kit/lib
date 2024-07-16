import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  StubConceptScheme as IStubConceptScheme,
} from "@kos-kit/models";
import { StubLabeledModel } from "./StubLabeledModel.js";
import { isRdfInstanceOf } from "@kos-kit/rdf-utils";
import { Just, Maybe, Nothing } from "purify-ts";
import { skos } from "@tpluscode/rdf-ns-builders";

export class StubConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends StubLabeledModel<ConceptT, ConceptSchemeT, LabelT, ConceptSchemeT>
  implements IStubConceptScheme
{
  async resolve(): Promise<Maybe<ConceptSchemeT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    // TODO: fetch all required fields here
    if (
      isRdfInstanceOf({
        class_: skos.ConceptScheme,
        dataset: this.resource.dataset,
        instance: this.identifier,
      })
    ) {
      return Just(this.modelFactory.createConceptScheme(this.resource));
    }
    return Nothing;
  }
}
