import { expect, it } from "vitest";
import { ConceptScheme, LanguageTag } from "..";
import { behavesLikeLabeledModel } from "./behavesLikeLabeledModel.js";

export const behavesLikeConceptScheme = (
  lazyConceptScheme: (
    includeLanguageTag: LanguageTag,
  ) => Promise<ConceptScheme>,
) => {
  it("should get a concept by its identifier", async () => {
    const conceptScheme = await lazyConceptScheme("en");

    const firstConcepts = (
      await conceptScheme.conceptsPage({
        limit: 1,
        offset: 0,
      })
    ).toArray();
    expect(firstConcepts).toHaveLength(1);
    const firstConcept = firstConcepts[0];

    const conceptByIdentifier = (
      await conceptScheme.conceptByIdentifier(firstConcept.identifier)
    ).extractNullable();
    expect(conceptByIdentifier).not.toBeNull();
    expect(
      conceptByIdentifier?.identifier.equals(firstConcept.identifier),
    ).toBe(true);
  });

  it("should get concept pages", async () => {
    const conceptScheme = await lazyConceptScheme("en");

    const firstConcepts = (
      await conceptScheme.conceptsPage({
        limit: 10,
        offset: 0,
      })
    ).toArray();
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = (
      await conceptScheme.conceptsPage({
        limit: 10,
        offset: 10,
      })
    ).toArray();
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBe(true);
    }
  });

  it("should get concepts", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    for await (const concept of conceptScheme.concepts()) {
      expect(
        (await concept.resolve()).extractNullable()?.displayLabel,
      ).toBeDefined();
      return;
    }
  });

  it("should get concepts count", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(await conceptScheme.conceptsCount()).toStrictEqual(4482);
  });

  it("should get top concept pages", async () => {
    const conceptScheme = await lazyConceptScheme("en");

    const firstConcepts = (
      await conceptScheme.topConceptsPage({
        limit: 10,
        offset: 0,
      })
    ).toArray();
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = (
      await conceptScheme.topConceptsPage({
        limit: 10,
        offset: 10,
      })
    ).toArray();
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBe(true);
    }
  });

  it("should get top concepts", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    for await (const topConcept of conceptScheme.topConcepts()) {
      expect(
        (await topConcept.resolve()).extractNullable()?.displayLabel,
      ).toBeTruthy();
      return;
    }
  });

  it("should get top concepts count", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(await conceptScheme.topConceptsCount()).toStrictEqual(585);
  });

  behavesLikeLabeledModel(lazyConceptScheme);
};
