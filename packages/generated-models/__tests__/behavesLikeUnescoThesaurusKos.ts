import { DataFactory } from "n3";
import { assert, expect, it } from "vitest";
import { Kos, LanguageTag, SemanticRelationProperty } from "../index.js";

export const behavesLikeUnescoThesaurusKos = (
  kosFactory: (languageIn: LanguageTag) => Kos,
) => {
  const kos = kosFactory("en");

  it("concept", async () => {
    for (const expectedConceptIdentifier of await kos.conceptIdentifiers({
      limit: 1,
      offset: 0,
      query: { type: "All" },
    })) {
      const actualConcept = (
        await kos.concept(expectedConceptIdentifier)
      ).unsafeCoerce();
      expect(
        expectedConceptIdentifier.equals(actualConcept.identifier),
      ).toStrictEqual(true);
      return;
    }
    assert.fail("no concepts");
  });

  it("conceptIdentifiers: All", async () => {
    const firstConceptIdentifiers = [
      ...(await kos.conceptIdentifiers({
        limit: 10,
        offset: 0,
        query: { type: "All" },
      })),
    ];
    expect(firstConceptIdentifiers).toHaveLength(10);

    const nextConceptIdentifiers = [
      ...(await kos.conceptIdentifiers({
        limit: 10,
        offset: 10,
        query: { type: "All" },
      })),
    ];
    expect(nextConceptIdentifiers).toHaveLength(10);
    for (const nextConceptIdentifier of nextConceptIdentifiers) {
      expect(
        firstConceptIdentifiers.every(
          (firstConceptIdentifier) =>
            !firstConceptIdentifier.equals(nextConceptIdentifier),
        ),
      ).toBe(true);
    }
  });

  it("conceptIdentifiers: SubjectsOfSemanticRelation", async ({ expect }) => {
    const subjectConceptIdentifiers = [
      ...(await kos.conceptIdentifiers({
        limit: null,
        offset: 0,
        query: {
          objectConceptIdentifier: DataFactory.namedNode(
            "http://vocabularies.unesco.org/thesaurus/concept10018",
          ),
          semanticRelationProperty: SemanticRelationProperty.NARROWER,
          type: "SubjectsOfSemanticRelation",
        },
      })),
    ];
    expect(subjectConceptIdentifiers).toHaveLength(1);
    expect(
      subjectConceptIdentifiers.find((subjectConceptIdentifier) =>
        subjectConceptIdentifier.equals(
          DataFactory.namedNode(
            "http://vocabularies.unesco.org/thesaurus/concept197",
          ),
        ),
      ),
    ).toBeDefined;
  });

  it("conceptScheme", async () => {
    for (const expectedConceptSchemeIdentifier of await kos.conceptSchemeIdentifiers(
      {
        limit: null,
        offset: 0,
        query: { type: "All" },
      },
    )) {
      const actualConceptScheme = (
        await kos.conceptScheme(expectedConceptSchemeIdentifier)
      ).unsafeCoerce();
      expect(
        expectedConceptSchemeIdentifier.equals(actualConceptScheme.identifier),
      ).toBeTruthy();
    }
  });

  it("conceptSchemeIdentifiers", async () => {
    const conceptSchemeIdentifiers = await kos.conceptSchemeIdentifiers({
      limit: null,
      offset: 0,
      query: { type: "All" },
    });
    expect(conceptSchemeIdentifiers).not.toHaveLength(0);
  });

  it("conceptSchemeStubs", async () => {
    const conceptSchemeStubs = await kos.conceptSchemeStubs({
      limit: null,
      offset: 0,
      query: { type: "All" },
    });
    expect(conceptSchemeStubs).toHaveLength(1);
    const conceptSchemeStub = conceptSchemeStubs[0];
    expect(conceptSchemeStub.prefLabel).toHaveLength(1);
    const prefLabel = conceptSchemeStub.prefLabel[0];
    expect(prefLabel.language).toStrictEqual("en");
    expect(prefLabel.value).toStrictEqual("UNESCO Thesaurus");
  });

  it("conceptSchemesCount", async () => {
    expect(await kos.conceptSchemesCount({ type: "All" })).toStrictEqual(1);
  });

  it("conceptStubs", async () => {
    const conceptStubs = await kos.conceptStubs({
      limit: 10,
      offset: 0,
      query: { type: "All" },
    });
    expect(conceptStubs).toHaveLength(10);
    const conceptStub = conceptStubs[0];
    expect(conceptStub.prefLabel).toHaveLength(1);
    const prefLabel = conceptStub.prefLabel[0];
    expect(prefLabel.language).toStrictEqual("en");
    expect(prefLabel.value).toStrictEqual("Unknown");
  });

  it("conceptsCount", async () => {
    expect(await kos.conceptsCount({ type: "All" })).not.toStrictEqual(0);
  });
};
