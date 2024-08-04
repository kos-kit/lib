import { ConceptScheme, Kos, Stub } from "@kos-kit/models";
import { AsyncIterables } from "purify-ts-helpers";
import { assert, expect, it } from "vitest";
import { expectConcept } from "./expectConcept.js";
import { expectConceptScheme } from "./expectConceptScheme.js";

export const behavesLikeKos = (kos: Kos<any, any, any>) => {
  it("should get concepts", async () => {
    const firstConcepts = await AsyncIterables.toArray(
      kos.concepts({ limit: 10, offset: 0 }),
    );
    expect(firstConcepts).toHaveLength(10);
    for (const firstConcept of firstConcepts) {
      expectConcept((await firstConcept.resolve()).extractNullable());
    }

    const nextConcepts = await AsyncIterables.toArray(
      kos.concepts({ limit: 10, offset: 10 }),
    );
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
    for await (const concept of kos.concepts({
      limit: 1,
      offset: 0,
    })) {
      expectConcept((await concept.resolve()).extractNullable());
      const conceptByIdentifier = (
        await kos.conceptByIdentifier(concept.identifier).resolve()
      ).extractNullable();
      expectConcept(conceptByIdentifier);
      expect(
        concept.identifier.equals(conceptByIdentifier!.identifier),
      ).toStrictEqual(true);
      return;
    }
    assert.fail("no concepts");
  });

  it("should get a count of concepts", async () => {
    expect(await kos.conceptsCount()).not.toStrictEqual(0);
  });

  it("should get concept schemes", async () => {
    const conceptSchemes: Stub<ConceptScheme<any, any>>[] = [];
    for await (const conceptScheme of kos.conceptSchemes()) {
      conceptSchemes.push(conceptScheme);
    }
    expect(conceptSchemes).not.toHaveLength(0);
    expectConceptScheme((await conceptSchemes[0].resolve()).extractNullable());
  });

  it("should get a concept scheme by an identifier", async () => {
    for await (const conceptScheme of kos.conceptSchemes()) {
      expectConceptScheme((await conceptScheme.resolve()).extractNullable());
      const conceptSchemeByIdentifier = (
        await kos.conceptSchemeByIdentifier(conceptScheme.identifier).resolve()
      ).extractNullable();
      expect(conceptSchemeByIdentifier).toBeTruthy();
      expectConceptScheme(conceptSchemeByIdentifier!);
      expect(
        conceptScheme.identifier.equals(conceptSchemeByIdentifier!.identifier),
      ).toBeTruthy();
    }
  });
};
