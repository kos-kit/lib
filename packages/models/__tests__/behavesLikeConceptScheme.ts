import * as O from "fp-ts/Option";
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

    const firstConcepts = await conceptScheme.conceptsPage({
      limit: 1,
      offset: 0,
    });
    expect(firstConcepts).toHaveLength(1);
    const firstConcept = firstConcepts[0];

    const conceptByIdentifier = O.toNullable(
      await conceptScheme.conceptByIdentifier(firstConcept.identifier),
    );
    expect(conceptByIdentifier).not.toBeNull();
    expect(conceptByIdentifier?.identifier.equals(firstConcept.identifier));
  });

  it("should get concept pages", async () => {
    const conceptScheme = await lazyConceptScheme("en");

    const firstConcepts = await conceptScheme.conceptsPage({
      limit: 10,
      offset: 0,
    });
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = await conceptScheme.conceptsPage({
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

  it("should get concepts", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    for await (const concept of conceptScheme.concepts()) {
      expect(concept.displayLabel);
      return;
    }
  });

  it("should get concepts count", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(await conceptScheme.conceptsCount()).toStrictEqual(4482);
  });

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
      return;
    }
  });

  it("should get top concepts count", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(await conceptScheme.topConceptsCount()).toStrictEqual(585);
  });

  behavesLikeLabeledModel(lazyConceptScheme);
};
