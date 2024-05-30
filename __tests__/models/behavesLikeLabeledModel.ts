import { Label } from "../../src/models/Label";
import { LabeledModel } from "../../src/models/LabeledModel";

export const behavesLikeLabeledModel = (
  lazyModel: () => Promise<LabeledModel>,
) => {
  const languageTags = new Set(["en", ""]);

  const expectLabels = (labels: readonly Label[]) => {
    expect(labels).toBeDefined();
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  };

  it("should get altLabels", async () => {
    const model = await lazyModel();
    expectLabels(await model.altLabels({ languageTags }));
  });

  it("should get hiddenLabels", async () => {
    const model = await lazyModel();
    expectLabels(await model.hiddenLabels({ languageTags }));
  });

  it("should get prefLabels", async () => {
    const model = await lazyModel();
    const prefLabels = await model.prefLabels({ languageTags });
    expect(prefLabels).not.toHaveLength(0);
    expectLabels(prefLabels);
  });
};
