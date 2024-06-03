import { Literal, NamedNode } from "@rdfjs/types";

export interface Model {
  readonly license: Literal | NamedNode | null;
  readonly modified: Literal | null;
  readonly rights: Literal | null;
  readonly rightsHolder: Literal | null;
}
