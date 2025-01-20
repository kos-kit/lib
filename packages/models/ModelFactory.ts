import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import sparqljs from "sparqljs";
import { Identifier } from "./Identifier.js";
import { LanguageTag } from "./LanguageTag.js";

export interface ModelFactory<T> {
  readonly fromRdf: (parameters: {
    ignoreRdfType?: boolean;
    languageIn: readonly LanguageTag[];
    resource: Resource<Identifier>;
  }) => Either<Resource.ValueError, T>;

  readonly sparqlConstructQueryString: (
    parameters?: {
      ignoreRdfType?: boolean;
      prefixes?: { [prefix: string]: string };
      subject?: sparqljs.Triple["subject"];
      variablePrefix?: string;
    } & Omit<sparqljs.ConstructQuery, "prefixes" | "queryType" | "type">,
  ) => string;
}
