import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Maybe } from "purify-ts";
import { Stub } from "./Stub.js";

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
