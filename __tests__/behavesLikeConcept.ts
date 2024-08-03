import { Concept, LanguageTag } from "@kos-kit/models";
import { it } from "vitest";

export const behavesLikeConcept = (
  lazyConcept: (
    includeLanguageTag: LanguageTag,
  ) => Promise<Concept<any, any, any>>,
) => {
  it("should get labels", async ({ expect }) => {
    const labels = (await lazyConcept("en")).labels();
    expect(labels).not.toHaveLength(0);
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  });
};
