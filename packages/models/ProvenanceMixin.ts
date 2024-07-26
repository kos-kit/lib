import { Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Maybes } from "./Maybes.js";

export interface ProvenanceMixin {
  readonly license: Maybe<Literal | NamedNode>;
  readonly modified: Maybe<Literal>;
  readonly rights: Maybe<Literal>;
  readonly rightsHolder: Maybe<Literal>;
}

export namespace ProvenanceMixin {
  export function equals(
    left: ProvenanceMixin,
    right: ProvenanceMixin,
  ): boolean {
    if (
      !Maybes.equals(left.license, right.license, (left, right) =>
        left.equals(right),
      )
    ) {
      return false;
    }

    if (
      !Maybes.equals(left.modified, right.modified, (left, right) =>
        left.equals(right),
      )
    ) {
      return false;
    }

    if (
      !Maybes.equals(left.rights, right.rights, (left, right) =>
        left.equals(right),
      )
    ) {
      return false;
    }

    if (
      !Maybes.equals(left.rightsHolder, right.rightsHolder, (left, right) =>
        left.equals(right),
      )
    ) {
      return false;
    }

    return true;
  }
}
