import * as sparqlBuilder from "@kos-kit/sparql-builder";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import { Identifier } from "./Identifier.js";
import { LanguageTag } from "./LanguageTag.js";

export interface ModelFactory<T> {
  readonly SparqlGraphPatterns: new (
    subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
    _options?: { ignoreRdfType?: boolean },
  ) => sparqlBuilder.GraphPatterns;

  readonly fromRdf: (parameters: {
    languageIn: readonly LanguageTag[];
    resource: Resource<Identifier>;
  }) => Either<Resource.ValueError, T>;
}
