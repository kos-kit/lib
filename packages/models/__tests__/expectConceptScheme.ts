import { ConceptScheme } from "../../src/models/ConceptScheme";

/**
 * Basic assertions about every conceptScheme scheme.
 */
export function expectConceptScheme(conceptScheme: ConceptScheme): void {
  expect(conceptScheme.identifier).toBeDefined();
  expect(conceptScheme.prefLabels).not.toHaveLength(0);
  for (const prefLabel of conceptScheme.prefLabels) {
    expect(prefLabel.literalForm.value).not.toHaveLength(0);
  }
}
