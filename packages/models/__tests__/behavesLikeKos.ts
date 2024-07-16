/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { assert, expect, it } from "vitest";
import { Kos } from "..";
import { expectConcept } from "./expectConcept.js";
import { expectConceptScheme } from "./expectConceptScheme.js";

export const behavesLikeKos = (kos: Kos) => {
  it("should get concepts", async () => {
    const firstConcepts = await kos.conceptsPage({ limit: 10, offset: 0 });
    expect(firstConcepts).toHaveLength(10);
    for (const firstConcept of firstConcepts) {
      expectConcept((await firstConcept.resolve()).extractNullable());
    }

    const nextConcepts = await kos.conceptsPage({ limit: 10, offset: 10 });
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expectConcept((await nextConcept.resolve()).extractNullable());
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBe(true);
    }
  });

  it("should get a concept by its identifier", async () => {
    for (const concept of await kos.conceptsPage({
      limit: 1,
      offset: 0,
    })) {
      expectConcept((await concept.resolve()).extractNullable());
      const conceptByIdentifier = (
        await kos.conceptByIdentifier(concept.identifier)
      ).extractNullable();
      expectConcept(conceptByIdentifier);
      expect(
        concept.identifier.equals(conceptByIdentifier!.identifier),
      ).toStrictEqual(true);
      return;
    }
    assert.fail("no concepts");
  });

  it("should get multiple concepts by their identifiers", async () => {
    const conceptsPage = await kos.conceptsPage({
      limit: 5,
      offset: 0,
    });
    expect(conceptsPage).toHaveLength(5);
    const conceptsByIdentifiers = await kos.conceptsByIdentifiers(
      conceptsPage.map((concept) => concept.identifier),
    );
    expect(conceptsByIdentifiers).toHaveLength(5);
    conceptsPage.forEach((leftConcept, conceptI) => {
      const rightConcept = conceptsByIdentifiers[conceptI].extractNullable();
      expect(rightConcept).toBeTruthy();
      expect(
        leftConcept.identifier.equals(rightConcept!.identifier),
      ).toStrictEqual(true);
    });
  });

  it("should get a count of concepts", async () => {
    expect(await kos.conceptsCount()).toStrictEqual(4482);
  });

  it("should get concept schemes", async () => {
    const conceptSchemes = await kos.conceptSchemes();
    expect(conceptSchemes).toHaveLength(1);
    expectConceptScheme((await conceptSchemes[0].resolve()).extractNullable());
  });

  it("should get a concept scheme by an identifier", async () => {
    for (const conceptScheme of await kos.conceptSchemes()) {
      expectConceptScheme((await conceptScheme.resolve()).extractNullable());
      const conceptSchemeByIdentifier = (
        await kos.conceptSchemeByIdentifier(conceptScheme.identifier)
      ).extractNullable();
      expectConceptScheme(conceptSchemeByIdentifier);
      expect(
        conceptScheme.identifier.equals(conceptSchemeByIdentifier!.identifier),
      ).toBeTruthy();
    }
  });
};
