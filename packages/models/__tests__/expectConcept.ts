import { Concept } from "../src";
import { expect } from "vitest";

/**
 * Basic assertions about every concept.
 */
export function expectConcept(concept: Concept): void {
  expect(concept.identifier).toBeDefined();
  expect(concept.prefLabels).not.toHaveLength(0);
  for (const prefLabel of concept.prefLabels) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
