import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
} from "@kos-kit/models";
import { Stub } from "./Stub.js";
import { Maybe } from "purify-ts";

export class ConceptStub<
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> extends Stub<SparqlConceptT, SparqlConceptSchemeT, SparqlConceptT> {
  async resolve(): Promise<Maybe<SparqlConceptT>> {
    return (
      await this.modelFetcher.fetchConceptsByIdentifiers([this.identifier])
    )[0];
  }
}
