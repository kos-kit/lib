import { DataFactory } from "n3";
import { assert, expect, it } from "vitest";
import { Kos, LanguageTag, SemanticRelationProperty } from "../index.js";
import { behavesLikeUnescoThesaurusConcept10 } from "./behavesLikeUnescoThesaurusConcept10.js";
import { behavesLikeUnescoThesaurusConcept10018 } from "./behavesLikeUnescoThesaurusConcept10018.js";
import { behavesLikeUnescoThesaurusConceptScheme } from "./behavesLikeUnescoThesaurusConceptScheme.js";

export const behavesLikeUnescoThesaurusKos = (
  kosFactory: (languageIn: LanguageTag) => Kos,
) => {
  const kos = kosFactory("en");

  it("UNESCO thesaurus KOS: concept", async () => {
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

  it("UNESCO thesaurus KOS: conceptIdentifiers: All", async () => {
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

  it("UNESCO thesaurus KOS: conceptIdentifiers: SubjectsOfSemanticRelation", async ({
    expect,
  }) => {
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

  it("UNESCO thesaurus KOS: conceptScheme", async () => {
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

  it("UNESCO thesaurus KOS: conceptSchemeIdentifiers", async () => {
    const conceptSchemeIdentifiers = await kos.conceptSchemeIdentifiers({
      limit: null,
      offset: 0,
      query: { type: "All" },
    });
    expect(conceptSchemeIdentifiers).not.toHaveLength(0);
  });

  it("UNESCO thesaurus KOS: conceptSchemeStub", async () => {
    const expectedConceptSchemeStubs = await kos.conceptSchemeStubs({
      limit: 1,
      offset: 0,
      query: { type: "All" },
    });
    expect(expectedConceptSchemeStubs).toHaveLength(1);
    const expectedConceptSchemeStub = expectedConceptSchemeStubs[0];
    expect(expectedConceptSchemeStub.prefLabel).toHaveLength(1);
    const expectedPrefLabel = expectedConceptSchemeStub.prefLabel[0];
    expect(expectedPrefLabel.language).toStrictEqual("en");
    expect(expectedPrefLabel.value).toStrictEqual("UNESCO Thesaurus");

    const actualConceptSchemeStub = (
      await kos.conceptSchemeStub(expectedConceptSchemeStub.identifier)
    ).unsafeCoerce();
    expect(
      actualConceptSchemeStub.identifier.equals(
        expectedConceptSchemeStub.identifier,
      ),
    ).toStrictEqual(true);
    expect(
      actualConceptSchemeStub.identifier.equals(
        expectedConceptSchemeStub.identifier,
      ),
    ).toStrictEqual(true);
    const actualPrefLabel = expectedConceptSchemeStub.prefLabel[0];
    expect(actualPrefLabel.language).toStrictEqual("en");
    expect(actualPrefLabel.value).toStrictEqual("UNESCO Thesaurus");
  });

  it("UNESCO thesaurus KOS: conceptSchemeStubs", async () => {
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

  it("UNESCO thesaurus KOS: conceptSchemesCount", async () => {
    expect(await kos.conceptSchemesCount({ type: "All" })).toStrictEqual(1);
  });

  it("UNESCO thesaurus KOS: conceptStub", async () => {
    const expectedConceptStubs = await kos.conceptStubs({
      limit: 1,
      offset: 0,
      query: { type: "All" },
    });
    expect(expectedConceptStubs).toHaveLength(1);
    const expectedConceptStub = expectedConceptStubs[0];
    expect(expectedConceptStub.prefLabel).toHaveLength(1);
    const expectedPrefLabel = expectedConceptStub.prefLabel[0];
    expect(expectedPrefLabel.language).toStrictEqual("en");
    expect(expectedPrefLabel.value).toStrictEqual("Right to education");

    const actualConceptStub = (
      await kos.conceptStub(expectedConceptStub.identifier)
    ).unsafeCoerce();
    expect(
      actualConceptStub.identifier.equals(expectedConceptStub.identifier),
    ).toStrictEqual(true);
    expect(
      actualConceptStub.identifier.equals(expectedConceptStub.identifier),
    ).toStrictEqual(true);
    const actualPrefLabel = expectedConceptStub.prefLabel[0];
    expect(actualPrefLabel.language).toStrictEqual("en");
    expect(actualPrefLabel.value).toStrictEqual("Right to education");
  });

  it("UNESCO thesaurus KOS: conceptStubs", async () => {
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
    expect(prefLabel.value).toStrictEqual("Right to education");
  });

  it("UNESCO thesaurus KOS: conceptsCount", async () => {
    expect(await kos.conceptsCount({ type: "All" })).not.toStrictEqual(0);
  });

  behavesLikeUnescoThesaurusConceptScheme(kosFactory);
  behavesLikeUnescoThesaurusConcept10(kosFactory);
  behavesLikeUnescoThesaurusConcept10018(kosFactory);
};
