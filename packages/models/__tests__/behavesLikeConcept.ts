import { it } from "vitest";
import { Concept, LanguageTag } from "..";

export const behavesLikeConcept = (
  lazyConcept: (includeLanguageTag: LanguageTag) => Promise<Concept>,
) => {
  it("should get labels", async ({ expect }) => {
    const labels = (await lazyConcept("en")).labels();
    expect(labels).not.toHaveLength(0);
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  });
};
