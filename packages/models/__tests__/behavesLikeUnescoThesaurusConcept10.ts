import { DataFactory } from "n3";
import { expect, it } from "vitest";
import { Kos, LanguageTag } from "../index.js";

export function behavesLikeUnescoThesaurusConcept10(
  kosFactory: (languageIn: LanguageTag) => Kos,
) {
  const testConcept = async (languageIn: LanguageTag) =>
    kosFactory(languageIn)
      .concept(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10",
        ),
      )
      .then((concept) => concept.unsafeCoerce());

  it("UNESCO thesaurus concept 10: should be in the single concept scheme", async () => {
    const concept = await testConcept("en");
    for (const inSchemes of [concept.topConceptOf, concept.inScheme]) {
      expect(inSchemes).toHaveLength(1);
      expect(
        inSchemes[0].identifier.equals(
          DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
        ),
      );
    }
  });

  it("UNESCO thesaurus concept 10: should have a modified date", async () => {
    const concept = await testConcept("en");
    expect(concept.modified.extractNullable()?.getTime()).toStrictEqual(
      Date.parse("2019-12-15T13:26:49Z"),
    );
  });

  it("UNESCO thesaurus concept 10: should have multiple prefLabels", async () => {
    const conceptEn = await testConcept("en");
    const conceptFr = await testConcept("fr");

    const enPrefLabels = conceptEn.prefLabel;
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].value).toStrictEqual("Right to education");

    const frPrefLabels = conceptFr.prefLabel;
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].value).toStrictEqual("Droit à l'éducation");
  });

  it("UNESCO thesaurus concept 10: should be a top concept of the single concept scheme", async () => {
    const concept = await testConcept("en");
    const topConceptOf = concept.topConceptOf;
    expect(topConceptOf).toHaveLength(1);
    expect(
      topConceptOf[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("UNESCO thesaurus concept 10: should have known semantic relations", async () => {
    const concept = await testConcept("en");
    for (const { actualConcepts, expectedConceptNumbers } of [
      {
        actualConcepts: concept.narrower,
        expectedConceptNumbers: [4938, 7597],
      },
      {
        actualConcepts: concept.related,
        expectedConceptNumbers: [9, 556, 557, 1519, 5052],
      },
    ]) {
      expect(actualConcepts).toHaveLength(expectedConceptNumbers.length);
      for (const expectedConceptNumber of expectedConceptNumbers) {
        const expectedConceptIdentifier = DataFactory.namedNode(
          `http://vocabularies.unesco.org/thesaurus/concept${expectedConceptNumber}`,
        );
        expect(
          actualConcepts.find((actualConcept) =>
            actualConcept.identifier.equals(expectedConceptIdentifier),
          ),
        ).toBeDefined();
      }
    }
  });
}
