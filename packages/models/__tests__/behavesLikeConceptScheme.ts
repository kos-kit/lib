import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";
import { ConceptScheme, LanguageTag } from "../src";
import { expect, it } from "vitest";

export const behavesLikeConceptScheme = (
  lazyConceptScheme: (
    includeLanguageTag: LanguageTag,
  ) => Promise<ConceptScheme>,
) => {
  it("should get top concept pages", async () => {
    const conceptScheme = await lazyConceptScheme("en");

    const firstConcepts = await conceptScheme.topConceptsPage({
      limit: 10,
      offset: 0,
    });
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = await conceptScheme.topConceptsPage({
      limit: 10,
      offset: 10,
    });
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBeTruthy();
    }
  });

  it("should get top concepts", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    for await (const topConcept of conceptScheme.topConcepts()) {
      expect(topConcept.displayLabel);
    }
    return;
  });

  it("should get top concepts count", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(await conceptScheme.topConceptsCount()).toStrictEqual(585);
  });

  behavesLikeLabeledModel(lazyConceptScheme);
};
