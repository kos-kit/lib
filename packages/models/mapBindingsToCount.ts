import { BlankNode, Literal, NamedNode } from "@rdfjs/types";

export function mapBindingsToCount(
  bindings: readonly Record<string, BlankNode | Literal | NamedNode>[],
  variable: string,
): number {
  if (bindings.length === 0) {
    throw new Error("empty result rows");
  }
  if (bindings.length > 1) {
    throw new Error("more than one result row");
  }
  const count = bindings[0][variable];
  if (typeof count === "undefined") {
    throw new Error("no 'count' variable in result row");
  }
  if (count.termType !== "Literal") {
    throw new Error("'count' variable is not a Literal");
  }
  const parsedCount = Number.parseInt(count.value);
  if (Number.isNaN(parsedCount)) {
    throw new Error("'count' variable is NaN");
  }
  return parsedCount;
}
