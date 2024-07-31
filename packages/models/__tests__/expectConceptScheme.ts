import { expect } from "vitest";
import { ConceptScheme } from "..";

/**
 * Basic assertions about every conceptScheme scheme.
 */
export function expectConceptScheme(conceptScheme: ConceptScheme | null): void {
  expect(conceptScheme).not.toBeNull();
  expect(conceptScheme!.identifier).toBeTruthy();
  expect(conceptScheme!.prefLabels).not.toHaveLength(0);
  for (const prefLabel of conceptScheme!.prefLabels) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
