import { Variable } from "@rdfjs/types";
import { Either } from "purify-ts";
import { Resource } from "rdfjs-resource";
import sparqljs from "sparqljs";
import { Identifier } from "./Identifier.js";
import { LanguageTag } from "./LanguageTag.js";

export interface ModelFactory<T> {
  readonly fromRdf: (parameters: {
    languageIn: readonly LanguageTag[];
    resource: Resource<Identifier>;
  }) => Either<Resource.ValueError, T>;

  readonly sparqlConstructQueryString: (
    parameters?: {
      subject: Variable;
    } & Omit<
      sparqljs.ConstructQuery,
      "prefixes" | "queryType" | "template" | "type" | "where"
    >,
  ) => string;
}
