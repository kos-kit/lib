import { DataFactory } from "n3";
import { assert, expect, it } from "vitest";
import { Kos, LanguageTag, SemanticRelationProperty } from "../index.js";
import { behavesLikeUnescoThesaurusConcept10 } from "./behavesLikeUnescoThesaurusConcept10.js";
import { behavesLikeUnescoThesaurusConcept10018 } from "./behavesLikeUnescoThesaurusConcept10018.js";
import { behavesLikeUnescoThesaurusConceptScheme } from "./behavesLikeUnescoThesaurusConceptScheme.js";

const conceptSchemeIri = DataFactory.namedNode(
  "http://vocabularies.unesco.org/thesaurus",
);
const concept10Iri = DataFactory.namedNode(
  "http://vocabularies.unesco.org/thesaurus/concept10",
);
const concept197Iri = DataFactory.namedNode(
  "http://vocabularies.unesco.org/thesaurus/concept197",
);
const concept4938Iri = DataFactory.namedNode(
  "http://vocabularies.unesco.org/thesaurus/concept4938",
);
const concept7597Iri = DataFactory.namedNode(
  "http://vocabularies.unesco.org/thesaurus/concept7597",
);
const concept10018Iri = DataFactory.namedNode(
  "http://vocabularies.unesco.org/thesaurus/concept10018",
);

export const behavesLikeUnescoThesaurusKos = (
  kosFactory: (languageIn: LanguageTag) => Kos,
) => {
  const kos = kosFactory("en");

  it("UNESCO thesaurus KOS: concept", async () => {
    for (const expectedConceptIdentifier of (
      await kos.conceptIdentifiers({
        limit: 1,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce()) {
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
    const firstConceptIdentifiers = (
      await kos.conceptIdentifiers({
        limit: 10,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce();
    expect(firstConceptIdentifiers).toHaveLength(10);

    const nextConceptIdentifiers = (
      await kos.conceptIdentifiers({
        limit: 10,
        offset: 10,
        query: { type: "All" },
      })
    ).unsafeCoerce();
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

  it("UNESCO thesaurus KOS: conceptIdentifiers: InScheme", async () => {
    const conceptIdentifiers = (
      await kos.conceptIdentifiers({
        limit: 10,
        offset: 0,
        query: {
          conceptIdentifier: concept10Iri,
          conceptSchemeIdentifier: conceptSchemeIri,
          type: "InScheme",
        },
      })
    ).unsafeCoerce();
    expect(conceptIdentifiers).toHaveLength(1);
    expect(conceptIdentifiers[0].equals(concept10Iri)).toStrictEqual(true);
  });

  it("UNESCO thesaurus KOS: conceptIdentifiers: ObjectsOfSemanticRelations", async ({
    expect,
  }) => {
    const objectConceptIdentifiers = (
      await kos.conceptIdentifiers({
        limit: null,
        offset: 0,
        query: {
          subjectConceptIdentifier: concept10Iri,
          semanticRelationProperties: [SemanticRelationProperty.NARROWER],
          type: "ObjectsOfSemanticRelations",
        },
      })
    ).unsafeCoerce();
    expect(objectConceptIdentifiers).toHaveLength(2);
    expect(
      objectConceptIdentifiers.find((conceptIdentifier) =>
        conceptIdentifier.equals(concept4938Iri),
      ),
    ).toBeDefined();
    expect(
      objectConceptIdentifiers.find((subjectConceptIdentifier) =>
        subjectConceptIdentifier.equals(concept7597Iri),
      ),
    ).toBeDefined();
  });

  it("UNESCO thesaurus KOS: conceptIdentifiers: ObjectsOfSemanticRelations (with inverse)", async ({
    expect,
  }) => {
    const objectConceptIdentifiers = (
      await kos.conceptIdentifiers({
        limit: null,
        offset: 0,
        query: {
          inverseSemanticRelationProperties: true,
          subjectConceptIdentifier: concept10Iri,
          semanticRelationProperties: [SemanticRelationProperty.NARROWER],
          type: "ObjectsOfSemanticRelations",
        },
      })
    ).unsafeCoerce();
    // The narrower concepts are also skos:broader to concept10, but the method should deduplicate
    expect(objectConceptIdentifiers).toHaveLength(2);
    expect(
      objectConceptIdentifiers.find((conceptIdentifier) =>
        conceptIdentifier.equals(concept4938Iri),
      ),
    ).toBeDefined();
    expect(
      objectConceptIdentifiers.find((subjectConceptIdentifier) =>
        subjectConceptIdentifier.equals(concept7597Iri),
      ),
    ).toBeDefined();
  });

  it("UNESCO thesaurus KOS: conceptIdentifiers: SubjectsOfSemanticRelation", async ({
    expect,
  }) => {
    const subjectConceptIdentifiers = (
      await kos.conceptIdentifiers({
        limit: null,
        offset: 0,
        query: {
          objectConceptIdentifier: concept10018Iri,
          semanticRelationProperties: [SemanticRelationProperty.NARROWER],
          type: "SubjectsOfSemanticRelations",
        },
      })
    ).unsafeCoerce();
    expect(subjectConceptIdentifiers).toHaveLength(1);
    expect(subjectConceptIdentifiers[0].equals(concept197Iri)).toStrictEqual(
      true,
    );
  });

  it("UNESCO thesaurus KOS: conceptScheme", async () => {
    for (const expectedConceptSchemeIdentifier of (
      await kos.conceptSchemeIdentifiers({
        limit: null,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce()) {
      const actualConceptScheme = (
        await kos.conceptScheme(expectedConceptSchemeIdentifier)
      ).unsafeCoerce();
      expect(
        expectedConceptSchemeIdentifier.equals(actualConceptScheme.identifier),
      ).toBeTruthy();
    }
  });

  it("UNESCO thesaurus KOS: conceptSchemeIdentifiers: All", async () => {
    const conceptSchemeIdentifiers = (
      await kos.conceptSchemeIdentifiers({
        limit: null,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce();
    expect(conceptSchemeIdentifiers).not.toHaveLength(0);
  });

  it("UNESCO thesaurus KOS: conceptSchemeIdentifiers: HasConcept 10", async () => {
    const conceptSchemeIdentifiers = (
      await kos.conceptSchemeIdentifiers({
        limit: null,
        offset: 0,
        query: {
          conceptIdentifier: concept10Iri,
          type: "HasConcept",
        },
      })
    ).unsafeCoerce();
    expect(conceptSchemeIdentifiers).toHaveLength(1);
    expect(conceptSchemeIdentifiers[0].equals(conceptSchemeIri)).toStrictEqual(
      true,
    );
  });

  it("UNESCO thesaurus KOS: conceptSchemeIdentifiers: HasConcept 10018", async () => {
    const conceptSchemeIdentifiers = (
      await kos.conceptSchemeIdentifiers({
        limit: null,
        offset: 0,
        query: {
          conceptIdentifier: concept10018Iri,
          type: "HasConcept",
        },
      })
    ).unsafeCoerce();
    expect(conceptSchemeIdentifiers).toHaveLength(1);
    expect(conceptSchemeIdentifiers[0].equals(conceptSchemeIri)).toStrictEqual(
      true,
    );
  });

  it("UNESCO thesaurus KOS: conceptSchemeIdentifiers: HasTopConcept 10", async () => {
    const conceptSchemeIdentifiers = (
      await kos.conceptSchemeIdentifiers({
        limit: null,
        offset: 0,
        query: {
          conceptIdentifier: concept10Iri,
          type: "HasTopConcept",
        },
      })
    ).unsafeCoerce();
    expect(conceptSchemeIdentifiers).toHaveLength(1);
    expect(conceptSchemeIdentifiers[0].equals(conceptSchemeIri)).toStrictEqual(
      true,
    );
  });

  it("UNESCO thesaurus KOS: conceptSchemeIdentifiers: HasTopConcept 10018", async () => {
    expect(
      (
        await kos.conceptSchemeIdentifiers({
          limit: null,
          offset: 0,
          query: {
            conceptIdentifier: concept10018Iri,
            type: "HasTopConcept",
          },
        })
      ).unsafeCoerce(),
    ).toHaveLength(0);
  });

  it("UNESCO thesaurus KOS: conceptSchemeStub", async () => {
    const expectedConceptSchemeStubs = (
      await kos.conceptSchemeStubs({
        limit: 1,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce();
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

  it("UNESCO thesaurus KOS: conceptSchemeStubs: All", async () => {
    const conceptSchemeStubs = (
      await kos.conceptSchemeStubs({
        limit: null,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce();
    expect(conceptSchemeStubs).toHaveLength(1);
    const conceptSchemeStub = conceptSchemeStubs[0];
    expect(conceptSchemeStub.prefLabel).toHaveLength(1);
    const prefLabel = conceptSchemeStub.prefLabel[0];
    expect(prefLabel.language).toStrictEqual("en");
    expect(prefLabel.value).toStrictEqual("UNESCO Thesaurus");
  });

  it("UNESCO thesaurus KOS: conceptSchemesCount: All", async () => {
    expect(
      (await kos.conceptSchemesCount({ type: "All" })).unsafeCoerce(),
    ).toStrictEqual(1);
  });

  it("UNESCO thesaurus KOS: conceptStub", async () => {
    const expectedConceptStubs = (
      await kos.conceptStubs({
        limit: 1,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce();
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

  it("UNESCO thesaurus KOS: conceptStubs: All", async () => {
    const conceptStubs = (
      await kos.conceptStubs({
        limit: 10,
        offset: 0,
        query: { type: "All" },
      })
    ).unsafeCoerce();
    expect(conceptStubs).toHaveLength(10);
    const conceptStub = conceptStubs[0];
    expect(conceptStub.prefLabel).toHaveLength(1);
    const prefLabel = conceptStub.prefLabel[0];
    expect(prefLabel.language).toStrictEqual("en");
    expect(prefLabel.value).toStrictEqual("Right to education");
  });

  it("UNESCO thesaurus KOS: conceptStubs: Identifiers", async () => {
    const conceptStubs = (
      await kos.conceptStubs({
        limit: 10,
        offset: 0,
        query: {
          conceptIdentifiers: [concept10Iri],
          type: "Identifiers",
        },
      })
    ).unsafeCoerce();
    expect(conceptStubs).toHaveLength(1);
    const conceptStub = conceptStubs[0];
    expect(conceptStub.prefLabel).toHaveLength(1);
    const prefLabel = conceptStub.prefLabel[0];
    expect(prefLabel.language).toStrictEqual("en");
    expect(prefLabel.value).toStrictEqual("Right to education");
  });

  it("UNESCO thesaurus KOS: conceptsCount: All", async () => {
    expect(
      (await kos.conceptsCount({ type: "All" })).unsafeCoerce(),
    ).toStrictEqual(4482);
  });

  it("UNESCO thesaurus KOS: conceptsCount: InScheme", async () => {
    expect(
      (
        await kos.conceptsCount({
          conceptSchemeIdentifier: conceptSchemeIri,
          type: "InScheme",
        })
      ).unsafeCoerce(),
    ).toStrictEqual(4482);
  });

  it("UNESCO thesaurus KOS: conceptsCount: TopConceptOf", async () => {
    expect(
      (
        await kos.conceptsCount({
          conceptSchemeIdentifier: conceptSchemeIri,
          type: "TopConceptOf",
        })
      ).unsafeCoerce(),
    ).toStrictEqual(585);
  });

  behavesLikeUnescoThesaurusConceptScheme(kosFactory);
  behavesLikeUnescoThesaurusConcept10(kosFactory);
  behavesLikeUnescoThesaurusConcept10018(kosFactory);
};
