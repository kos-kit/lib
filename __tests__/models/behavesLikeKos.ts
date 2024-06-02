import { Kos } from "../../src/models/Kos";

export const behavesLikeKos = (kos: Kos) => {
  it("should get concepts", async () => {
    const firstConcepts = await kos.conceptsPage({ limit: 10, offset: 0 });
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = await kos.conceptsPage({ limit: 10, offset: 10 });
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

  it("should get a concept by its identifier", async () => {
    for (const concept of await kos.conceptsPage({
      limit: 1,
      offset: 0,
    })) {
      expect(
        concept.identifier.equals(
          (await kos.conceptByIdentifier(concept.identifier)).identifier,
        ),
      ).toBeTruthy();
      return;
    }
    fail();
  });

  it("should get a count of concepts", async () => {
    expect(await kos.conceptsCount()).toStrictEqual(4482);
  });

  it("should get concept schemes", async () => {
    expect(await kos.conceptSchemes()).toHaveLength(1);
  });

  it("should get a concept scheme by an identifier", async () => {
    for (const conceptScheme of await kos.conceptSchemes()) {
      expect(
        conceptScheme.identifier.equals(
          (await kos.conceptSchemeByIdentifier(conceptScheme.identifier))
            .identifier,
        ),
      ).toBeTruthy();
    }
  });
};
