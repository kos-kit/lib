import * as oxigraph from "oxigraph";
import { expect } from "vitest";
import { ConstructQueryBuilder } from "../ConstructQueryBuilder";
import { GraphPatterns } from "../GraphPatterns.js";

export function testGraphPatterns(
  inputTtl: string,
  graphPatterns: GraphPatterns,
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

  // @ts-ignore
  const actualOutputQuads: oxigraph.Quad[] = inputStore.query(
    new ConstructQueryBuilder().addGraphPatterns(...graphPatterns).build(),
  );
  expect(actualOutputQuads).toHaveLength(expectedOutputStore.size);
  for (const expectedOutputQuad of expectedOutputStore.match()) {
    expect(
      actualOutputQuads.some((actualOutputQuad) =>
        actualOutputQuad.equals(expectedOutputQuad),
      ),
    ).toStrictEqual(true);
  }
}
