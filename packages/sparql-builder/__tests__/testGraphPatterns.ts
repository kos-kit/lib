import * as oxigraph from "oxigraph";
import { expect } from "vitest";
import { ConstructQueryBuilder } from "../ConstructQueryBuilder.js";
import { GraphPattern } from "../GraphPattern.js";

export function testGraphPatterns(
  inputTtl: string,
  graphPatterns: Iterable<GraphPattern>,
  options?: {
    expectedOutputTtl?: string;
  },
): void {
  const inputStore = new oxigraph.Store();
  inputStore.load(inputTtl, { format: "text/turtle" });

  let expectedOutputStore: oxigraph.Store;
  if (options?.expectedOutputTtl) {
    expectedOutputStore = new oxigraph.Store();
    expectedOutputStore.load(options?.expectedOutputTtl, {
      format: "text/turtle",
    });
  } else {
    expectedOutputStore = inputStore;
  }

  const query = new ConstructQueryBuilder()
    .addGraphPatterns(graphPatterns)
    .build();

  // @ts-ignore
  const actualOutputQuads: oxigraph.Quad[] = inputStore.query(query);
  expect(actualOutputQuads).toHaveLength(expectedOutputStore.size);
  for (const expectedOutputQuad of expectedOutputStore.match()) {
    expect(
      actualOutputQuads.some((actualOutputQuad) =>
        actualOutputQuad.equals(expectedOutputQuad),
      ),
    ).toStrictEqual(true);
  }
}
