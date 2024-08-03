import { expect } from "vitest";
import { Concept, Label } from "..";

/**
 * Basic assertions about every concept.
 */
export function expectConcept(concept: Concept<any, any, any> | null): void {
  expect(concept).not.toBeNull();
  expect(concept!.identifier).toBeDefined();
  expect(concept!.labels(Label.Type.PREFERRED)).not.toHaveLength(0);
  for (const prefLabel of concept!.labels(Label.Type.PREFERRED)) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
