import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import {
  Concept,
  ConceptScheme,
  ConceptSchemeStub,
  ConceptStub,
  Identifier,
  LanguageTag,
} from "./index.js";

type fromRdfFunction<T> = (parameters: {
  languageIn: readonly LanguageTag[];
  resource: Resource<Identifier>;
}) => Either<Resource.ValueError, T>;

export interface RdfjsModelFactory<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptStubT extends ConceptStub = ConceptStub,
> {
  readonly conceptFromRdf: fromRdfFunction<ConceptT>;
  readonly conceptSchemeFromRdf: fromRdfFunction<ConceptSchemeT>;
  readonly conceptSchemeStubFromRdf: fromRdfFunction<ConceptSchemeStubT>;
  readonly conceptStubFromRdf: fromRdfFunction<ConceptStubT>;
}

export namespace RdfjsModelFactory {
  export const default_: RdfjsModelFactory = {
    conceptFromRdf: Concept.fromRdf,
    conceptSchemeFromRdf: ConceptScheme.fromRdf,
    conceptSchemeStubFromRdf: ConceptSchemeStub.fromRdf,
    conceptStubFromRdf: ConceptStub.fromRdf,
  };
}
