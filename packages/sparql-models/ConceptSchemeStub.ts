import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Stub } from "./Stub.js";
import { Maybe } from "purify-ts";

export class ConceptSchemeStub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> extends Stub<SparqlConceptT, SparqlConceptSchemeT, SparqlConceptSchemeT> {
  async resolve(): Promise<Maybe<SparqlConceptSchemeT>> {
    return (
      await this.modelFetcher.fetchConceptSchemesByIdentifiers([
        this.identifier,
      ])
    )[0];
  }
}
