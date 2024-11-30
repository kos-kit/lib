import { ConceptScheme, Kos, Stub } from "@kos-kit/models";
import { assert, expect, it } from "vitest";
import { expectConcept } from "./expectConcept.js";
import { expectConceptScheme } from "./expectConceptScheme.js";

export const behavesLikeKos = (kos: Kos<any, any, any>) => {
  it("should get concepts", async () => {
    const firstConcepts = [
      ...(await kos.conceptsByQuery({
        limit: 10,
        offset: 0,
        query: { type: "All" },
      })),
    ];
    expect(firstConcepts).toHaveLength(10);
    for (const firstConcept of firstConcepts) {
      expectConcept((await firstConcept.resolve()).toMaybe().extractNullable());
    }

    const nextConcepts = [
      ...(await kos.conceptsByQuery({
        limit: 10,
        offset: 10,
        query: { type: "All" },
      })),
    ];
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expectConcept((await nextConcept.resolve()).toMaybe().extractNullable());
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBe(true);
    }
  });

  it("should get a concept by its identifier", async () => {
    for (const expectedConcept of await kos.conceptsByQuery({
      limit: 1,
      offset: 0,
      query: { type: "All" },
    })) {
      expectConcept(
        (await expectedConcept.resolve()).toMaybe().extractNullable(),
      );
      const actualConcept = (
        await kos.concept(expectedConcept.identifier).resolve()
      )
        .toMaybe()
        .extractNullable();
      expectConcept(actualConcept);
      expect(
        expectedConcept.identifier.equals(actualConcept!.identifier),
      ).toStrictEqual(true);
      return;
    }
    assert.fail("no concepts");
  });

  it("should get concepts by identifiers", async () => {
    const expectedConcepts = await (
      await kos.conceptsByQuery({
        limit: 10,
        offset: 0,
        query: { type: "All" },
      })
    ).flatResolve();
    expect(expectedConcepts).toHaveLength(10);

    const actualConcepts = await kos
      .conceptsByIdentifiers(
        expectedConcepts.map((concept) => concept.identifier),
      )
      .flatResolve();
    expect(actualConcepts).toHaveLength(10);

    for (let conceptI = 0; conceptI < expectedConcepts.length; conceptI++) {
      expect(
        actualConcepts[conceptI].identifier.equals(
          expectedConcepts[conceptI].identifier,
        ),
      ).toBeTruthy();
    }
  });

  it("should get a count of concepts", async () => {
    expect(await kos.conceptsCountByQuery({ type: "All" })).not.toStrictEqual(
      0,
    );
  });

  it("should get concept schemes", async () => {
    const conceptSchemes: Stub<ConceptScheme<any, any>>[] = [];
    for (const conceptScheme of await kos.conceptSchemesByQuery({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      conceptSchemes.push(conceptScheme);
    }
    expect(conceptSchemes).not.toHaveLength(0);
    expectConceptScheme(
      (await conceptSchemes[0].resolve()).toMaybe().extractNullable(),
    );
  });

  it("should get a concept scheme by an identifier", async () => {
    for (const expectedConceptScheme of await kos.conceptSchemesByQuery({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      expectConceptScheme(
        (await expectedConceptScheme.resolve()).toMaybe().extractNullable(),
      );
      const actualConceptScheme = (
        await kos.conceptScheme(expectedConceptScheme.identifier).resolve()
      )
        .toMaybe()
        .extractNullable();
      expect(actualConceptScheme).toBeTruthy();
      expectConceptScheme(actualConceptScheme!);
      expect(
        expectedConceptScheme.identifier.equals(
          actualConceptScheme!.identifier,
        ),
      ).toBeTruthy();
    }
  });

  it("should get concept schemes by identifiers", async () => {
    for (const expectedConceptScheme of await kos.conceptSchemesByQuery({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      expectConceptScheme(
        (await expectedConceptScheme.resolve()).toMaybe().extractNullable(),
      );
      const actualConceptSchemes = await kos
        .conceptSchemesByIdentifiers([expectedConceptScheme.identifier])
        .flatResolve();
      expect(actualConceptSchemes).toHaveLength(1);
      const actualConceptScheme = actualConceptSchemes[0];
      expect(actualConceptScheme).toBeTruthy();
      expectConceptScheme(actualConceptScheme!);
      expect(
        expectedConceptScheme.identifier.equals(
          actualConceptScheme!.identifier,
        ),
      ).toBeTruthy();
      return;
    }
  });
};
