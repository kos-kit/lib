import { Label, LabeledModel, LanguageTag } from "..";
import { expect, it } from "vitest";

export const behavesLikeLabeledModel = (
  lazyModel: (includeLanguageTag: LanguageTag) => Promise<LabeledModel>,
) => {
  const expectLabels = (labels: readonly Label[]) => {
    expect(labels).toBeDefined();
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  };

  it("should get altLabels", async () => {
    const model = await lazyModel("en");
    expectLabels(model.altLabels);
  });

  it("should get hiddenLabels", async () => {
    const model = await lazyModel("en");
    expectLabels(model.hiddenLabels);
  });

  it("should get prefLabels", async () => {
    const model = await lazyModel("en");
    const prefLabels = model.prefLabels;
    expect(prefLabels).not.toHaveLength(0);
    expectLabels(prefLabels);
  });
};
