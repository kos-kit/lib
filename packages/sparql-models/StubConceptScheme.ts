import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  StubConceptScheme as IStubConceptScheme,
} from "@kos-kit/models";
import { StubLabeledModel } from "./StubLabeledModel.js";
import { Maybe } from "purify-ts";

export class StubConceptScheme<
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends StubLabeledModel<
    SparqlConceptT,
    SparqlConceptSchemeT,
    SparqlConceptSchemeT
  >
  implements IStubConceptScheme
{
  async resolve(): Promise<Maybe<SparqlConceptSchemeT>> {
    return (
      await this.modelFetcher.fetchConceptSchemesByIdentifiers([
        this.identifier,
      ])
    )[0];
  }
}
