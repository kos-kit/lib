/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as O from "fp-ts/Option";
import { assert, expect, it } from "vitest";
import { Kos } from "..";
import { expectConcept } from "./expectConcept.js";
import { expectConceptScheme } from "./expectConceptScheme.js";

export const behavesLikeKos = (kos: Kos) => {
  it("should get concepts", async () => {
    const firstConcepts = await kos.conceptsPage({ limit: 10, offset: 0 });
    expect(firstConcepts).toHaveLength(10);
    for (const firstConcept of firstConcepts) {
      expectConcept(firstConcept);
    }

    const nextConcepts = await kos.conceptsPage({ limit: 10, offset: 10 });
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expectConcept(nextConcept);
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBeTruthy();
    }
  });

  it("should get a concept by its identifier", async () => {
    for (const concept of await kos.conceptsPage({
      limit: 1,
      offset: 0,
    })) {
      expectConcept(concept);
      const conceptByIdentifier = O.toNullable(
        await kos.conceptByIdentifier(concept.identifier),
      );
      expect(conceptByIdentifier).not.toBeNull();
      expectConcept(conceptByIdentifier!);
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
      const rightConcept = O.toNullable(conceptsByIdentifiers[conceptI]);
      expect(rightConcept).not.toBeNull();
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
    expectConceptScheme(conceptSchemes[0]);
  });

  it("should get a concept scheme by an identifier", async () => {
    for (const conceptScheme of await kos.conceptSchemes()) {
      expectConceptScheme(conceptScheme);
      const conceptSchemeByIdentifier = O.toNullable(
        await kos.conceptSchemeByIdentifier(conceptScheme.identifier),
      );
      expect(conceptSchemeByIdentifier).not.toBeNull();
      expectConceptScheme(conceptSchemeByIdentifier!);
      expect(
        conceptScheme.identifier.equals(conceptSchemeByIdentifier!.identifier),
      ).toBeTruthy();
    }
  });
};
