import { ConceptScheme, Label } from "@kos-kit/models";
import { expect } from "vitest";

/**
 * Basic assertions about every conceptScheme scheme.
 */
export function expectConceptScheme(
  conceptScheme: ConceptScheme<any, any> | null,
): void {
  expect(conceptScheme).not.toBeNull();
  expect(conceptScheme!.identifier).toBeTruthy();
  expect(
    conceptScheme!.labels({ types: [Label.Type.PREFERRED] }),
  ).not.toHaveLength(0);
  for (const prefLabel of conceptScheme!.labels({
    types: [Label.Type.PREFERRED],
  })) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
