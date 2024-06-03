import { ConceptScheme } from "../../src/models/ConceptScheme";
import { LanguageTag } from "../../src/models/LanguageTag";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel";

export const behavesLikeConceptScheme = (
  lazyConceptScheme: (
    includeLanguageTag: LanguageTag,
  ) => Promise<ConceptScheme>,
) => {
  it("should get top concepts", async () => {
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

  it("should get top concepts count", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(await conceptScheme.topConceptsCount()).toStrictEqual(585);
  });

  behavesLikeLabeledModel(lazyConceptScheme);
};
