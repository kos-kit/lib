/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Concept } from "..";
import { expect } from "vitest";

/**
 * Basic assertions about every concept.
 */
export function expectConcept(concept: Concept | null): void {
  expect(concept).not.toBeNull();
  expect(concept!.identifier).toBeDefined();
  expect(concept!.prefLabels).not.toHaveLength(0);
  for (const prefLabel of concept!.prefLabels) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
