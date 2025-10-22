import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import sparqljs from "sparqljs";
import { Identifier } from "./Identifier.js";
import { LanguageTag } from "./LanguageTag.js";

export interface ModelFactory<T> {
  readonly $fromRdf: (
    resource: Resource<Identifier>,
    parameters: {
      ignoreRdfType?: boolean;
      preferredLanguages?: readonly LanguageTag[];
    },
  ) => Either<Error, T>;

  readonly $sparqlConstructQueryString: (
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ) => string;
}
