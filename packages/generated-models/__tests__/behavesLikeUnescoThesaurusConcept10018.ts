import { DataFactory } from "n3";
import { expect, it } from "vitest";
import { Kos, LanguageTag } from "../index.js";

export function behavesLikeUnescoThesaurusConcept10018(
  kosFactory: (languageIn: LanguageTag) => Kos,
) {
  const testConcept = async (languageIn: LanguageTag) =>
    kosFactory(languageIn)
      .concept(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10018",
        ),
      )
      .then((concept) => concept.unsafeCoerce());

  it("should be in the single concept scheme", async () => {
    const concept = await testConcept("en");
    const inSchemes = concept.inScheme;
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have a modified date", async () => {
    const concept = await testConcept("en");
    expect(concept.modified.extract()?.getTime()).toStrictEqual(
      Date.parse("2019-12-15T13:44:31Z"),
    );
  });

  it("should have multiple altLabels", async () => {
    const conceptAr = await testConcept("ar");
    const conceptEs = await testConcept("es");

    const arAltLabels = conceptAr.altLabel;
    expect(arAltLabels).toHaveLength(1);
    expect(arAltLabels[0].value).toStrictEqual("تقييم التأثير على البيئة");

    const esAltLabels = conceptEs.altLabel;
    expect(esAltLabels).toHaveLength(1);
    expect(esAltLabels[0].value).toStrictEqual(
      "Valoración del impacto ambiental",
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptEn = await testConcept("en");
    const conceptFr = await testConcept("fr");

    const enPrefLabels = conceptEn.prefLabel;
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].value).toStrictEqual(
      "Environmental impact assessment",
    );

    const frPrefLabels = conceptFr.prefLabel;
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].value).toStrictEqual(
      "Évaluation de l'impact sur l'environnement",
    );
  });

  it("should have known semantic relations", async () => {
    const concept = await testConcept("en");
    for (const { actualConcepts, expectedConceptNumbers } of [
      {
        actualConcepts: concept.broader,
        expectedConceptNumbers: [197],
      },
      {
        actualConcepts: concept.related,
        expectedConceptNumbers: [207, 3317, 7775, 6317, 4533],
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

  it("should have multiple notes", async () => {
    const conceptEn = await testConcept("en");
    const conceptFr = await testConcept("fr");

    const notesEn = conceptEn.scopeNote;
    expect(notesEn).toHaveLength(1);
    expect(notesEn[0].value).toStrictEqual(
      "An activity designed to identify, predict, interpret and communicate information concerning the environmental consequences of policies, projects etc.",
    );

    const notesFr = conceptFr.scopeNote;
    expect(notesFr).toHaveLength(1);
    expect(notesFr[0].value).toStrictEqual(
      "Activité destinée à identifier, prévoir, interpréter et communiquer l'information ayant trait aux conséquences de politiques, de projets, etc., sur l'environnement.",
    );
  });
}
