import { Concept, Label } from "@kos-kit/models";
import { expect } from "vitest";

/**
 * Basic assertions about every concept.
 */
export function expectConcept(concept: Concept<any, any, any> | null): void {
  expect(concept).not.toBeNull();
  expect(concept!.identifier).toBeDefined();
  expect(concept!.labels({ types: [Label.Type.PREFERRED] })).not.toHaveLength(
    0,
  );
  for (const prefLabel of concept!.labels({ types: [Label.Type.PREFERRED] })) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
