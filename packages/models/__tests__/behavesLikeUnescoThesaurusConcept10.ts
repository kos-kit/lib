import { behavesLikeConcept } from "./behavesLikeConcept.js";
import { DataFactory } from "n3";
import { expectConcept } from "./expectConcept.js";
import { Concept, LanguageTag, SemanticRelationProperty } from "..";
import { expect, it } from "vitest";

export const behavesLikeUnescoThesaurusConcept10 = (
  lazyConcept: (includeLanguageTag: LanguageTag) => Promise<Concept>,
) => {
  it("should satisfy basic expect", async () => {
    const concept = await lazyConcept("en");
    expectConcept(concept);
  });

  it("should be in the single concept scheme", async () => {
    const concept = await lazyConcept("en");
    for (const inSchemes of [
      await concept.topConceptOf(),
      await concept.inSchemes(),
    ]) {
      expect(inSchemes).toHaveLength(1);
      expect(
        inSchemes[0].identifier.equals(
          DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
        ),
      );
    }
  });

  it("should have a modified date", async () => {
    const concept = await lazyConcept("en");
    expect(concept.modified.extractNullable()?.value).toStrictEqual(
      "2019-12-15T13:26:49Z",
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptEn = await lazyConcept("en");
    const conceptFr = await lazyConcept("fr");

    const enPrefLabels = conceptEn.prefLabels;
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual(
      "Right to education",
    );

    const frPrefLabels = conceptFr.prefLabels;
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Droit à l'éducation",
    );
  });

  it("should be a top concept of the single concept scheme", async () => {
    const concept = await lazyConcept("en");
    const topConceptOf = await concept.topConceptOf();
    expect(topConceptOf).toHaveLength(1);
    expect(
      topConceptOf[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have known semantic relations", async () => {
    const concept = await lazyConcept("en");
    for (const { semanticRelationProperty, conceptNumbers } of [
      {
        semanticRelationProperty: SemanticRelationProperty.NARROWER,
        conceptNumbers: [4938, 7597],
      },
      {
        semanticRelationProperty: SemanticRelationProperty.RELATED,
        conceptNumbers: [9, 556, 557, 1519, 5052],
      },
    ]) {
      expect(
        await concept.semanticRelationsCount(semanticRelationProperty),
      ).toStrictEqual(conceptNumbers.length);
      const semanticRelations = await concept.semanticRelations(
        semanticRelationProperty,
      );
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

  behavesLikeConcept(lazyConcept);
};
