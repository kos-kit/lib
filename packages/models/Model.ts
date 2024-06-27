import { Literal, NamedNode } from "@rdfjs/types";
import { Option } from "fp-ts/Option";

export interface Model {
  readonly license: Option<Literal | NamedNode>;
  readonly modified: Option<Literal>;
  readonly rights: Option<Literal>;
  readonly rightsHolder: Option<Literal>;
}
