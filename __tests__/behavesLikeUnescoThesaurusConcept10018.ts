import {
  Concept,
  ConceptScheme,
  Kos,
  Label,
  LanguageTag,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { DataFactory } from "n3";
import { expect, it } from "vitest";
import { behavesLikeConcept } from "./behavesLikeConcept.js";
import { expectConcept } from "./expectConcept.js";

export function behavesLikeUnescoThesaurusConcept10018<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
>(
  kosFactory: (
    includeLanguageTag: LanguageTag,
  ) => Kos<ConceptT, ConceptSchemeT, LabelT>,
) {
  const testConcept = (includeLanguageTag: LanguageTag) =>
    kosFactory(includeLanguageTag)
      .conceptByIdentifier(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10018",
        ),
      )
      .resolve()
      .then((concept) =>
        concept.orDefaultLazy(() => {
          throw new Error("missing concept");
        }),
      );

  it("should satisfy basic expect", async () => {
    const concept = await testConcept("en");
    expectConcept(concept);
  });

  it("should be in the single concept scheme", async () => {
    const concept = await testConcept("en");
    const inSchemes = [...(await concept.inSchemes())];
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have a modified date", async () => {
    const concept = await testConcept("en");
    expect(concept.modified.extractNullable()?.value).toStrictEqual(
      "2019-12-15T13:44:31Z",
    );
  });

  it("should have multiple alt labels", async () => {
    const conceptAr = await testConcept("ar");
    const conceptEs = await testConcept("es");

    const arAltLabels = conceptAr.labels(Label.Type.ALTERNATIVE);
    expect(arAltLabels).toHaveLength(1);
    expect(arAltLabels[0].literalForm.value).toStrictEqual(
      "تقييم التأثير على البيئة",
    );

    const esAltLabels = conceptEs.labels(Label.Type.ALTERNATIVE);
    expect(esAltLabels).toHaveLength(1);
    expect(esAltLabels[0].literalForm.value).toStrictEqual(
      "Valoración del impacto ambiental",
    );
  });

  it("should be in the single concept scheme", async () => {
    const concept = await testConcept("en");
    const inSchemes = [...(await concept.inSchemes())];
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptEn = await testConcept("en");
    const conceptFr = await testConcept("fr");

    const enPrefLabels = conceptEn.labels(Label.Type.PREFERRED);
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual(
      "Environmental impact assessment",
    );

    const frPrefLabels = conceptFr.labels(Label.Type.PREFERRED);
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Évaluation de l'impact sur l'environnement",
    );
  });

  it("should have known semantic relations", async () => {
    const concept = await testConcept("en");
    for (const { semanticRelationProperty, conceptNumbers } of [
      {
        semanticRelationProperty: SemanticRelationProperty.BROADER,
        conceptNumbers: [197],
      },
      {
        semanticRelationProperty: SemanticRelationProperty.RELATED,
        conceptNumbers: [207, 3317, 7775, 6317, 4533],
      },
    ]) {
      expect(
        await concept.semanticRelationsCount(semanticRelationProperty),
      ).toStrictEqual(conceptNumbers.length);
      const semanticRelations = [
        ...(await concept.semanticRelations(semanticRelationProperty)),
      ];
      expect(semanticRelations).toHaveLength(conceptNumbers.length);
      for (const conceptNumber of conceptNumbers) {
        const conceptIdentifier = DataFactory.namedNode(
          `http://vocabularies.unesco.org/thesaurus/concept${conceptNumber}`,
        );
        expect(
          semanticRelations.find((semanticRelation) =>
            semanticRelation.identifier.equals(conceptIdentifier),
          ),
        ).toBeDefined();
      }
    }
  });

  it("should have multiple notes", async () => {
    const conceptEn = await testConcept("en");
    const conceptFr = await testConcept("fr");

    const notesEn = await conceptEn.notes(NoteProperty.SCOPE_NOTE);
    expect(notesEn).toHaveLength(1);
    expect(notesEn[0].value).toStrictEqual(
      "An activity designed to identify, predict, interpret and communicate information concerning the environmental consequences of policies, projects etc.",
    );

    const notesFr = await conceptFr.notes(NoteProperty.SCOPE_NOTE);
    expect(notesFr).toHaveLength(1);
    expect(notesFr[0].value).toStrictEqual(
      "Activité destinée à identifier, prévoir, interpréter et communiquer l'information ayant trait aux conséquences de politiques, de projets, etc., sur l'environnement.",
    );
  });

  behavesLikeConcept(testConcept);
}
