import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  StubConcept as IStubConcept,
} from "@kos-kit/models";
import { StubLabeledModel } from "./StubLabeledModel.js";
import { isRdfInstanceOf } from "@kos-kit/rdf-utils";
import { Just, Maybe, Nothing } from "purify-ts";
import { skos } from "@tpluscode/rdf-ns-builders";

export class StubConcept<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends StubLabeledModel<ConceptT, ConceptSchemeT, LabelT, ConceptT>
  implements IStubConcept
{
  async resolve(): Promise<Maybe<ConceptT>> {
    // If there's an rdf:type statement then consider that we have the concept.
    if (
      isRdfInstanceOf({
        class_: skos.Concept,
        dataset: this.resource.dataset,
        instance: this.identifier,
      })
    ) {
      return Just(this.modelFactory.createConcept(this.resource));
    }
    return Nothing;
  }
}
