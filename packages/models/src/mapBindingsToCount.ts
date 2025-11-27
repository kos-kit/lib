import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Either, Left } from "purify-ts";

export function mapBindingsToCount(
  bindings: readonly Record<string, BlankNode | Literal | NamedNode>[],
  variable: string,
): Either<Error, number> {
  if (bindings.length === 0) {
    return Left(new Error("empty result rows"));
  }
  if (bindings.length > 1) {
    return Left(new Error("more than one result row"));
  }
  const count = bindings[0][variable];
  if (typeof count === "undefined") {
    return Left(new Error("no 'count' variable in result row"));
  }
  if (count.termType !== "Literal") {
    return Left(new Error("'count' variable is not a Literal"));
  }
  const parsedCount = Number.parseInt(count.value);
  if (Number.isNaN(parsedCount)) {
    return Left(new Error("'count' variable is NaN"));
  }
  return Either.of(parsedCount);
}
