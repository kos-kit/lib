import { ResultRow } from "sparql-http-client/ResultParser";

export function mapResultRowsToCount(
  resultRows: readonly ResultRow[],
  variable: string,
): number {
  if (resultRows.length === 0) {
    throw new Error("empty result rows");
  }
  if (resultRows.length > 1) {
    throw new Error("more than one result row");
  }
  const count = resultRows[0][variable];
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
