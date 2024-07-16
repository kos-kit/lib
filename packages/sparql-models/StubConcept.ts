import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  StubConcept as IStubConcept,
} from "@kos-kit/models";
import { StubLabeledModel } from "./StubLabeledModel.js";
import { Maybe } from "purify-ts";

export class StubConcept<
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends StubLabeledModel<SparqlConceptT, SparqlConceptSchemeT, SparqlConceptT>
  implements IStubConcept
{
  async resolve(): Promise<Maybe<SparqlConceptT>> {
    return (
      await this.modelFetcher.fetchConceptsByIdentifiers([this.identifier])
    )[0];
  }
}
