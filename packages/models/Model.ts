import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";

export interface Model {
  readonly license: Maybe<Literal | NamedNode>;
  readonly modified: Maybe<Literal>;
  readonly rights: Maybe<Literal>;
  readonly rightsHolder: Maybe<Literal>;
}
