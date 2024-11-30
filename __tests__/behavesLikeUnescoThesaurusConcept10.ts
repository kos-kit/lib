import {
  Concept,
  ConceptScheme,
  Kos,
  Label,
  LanguageTag,
  SemanticRelation,
} from "@kos-kit/models";
import { DataFactory } from "n3";
import { expect, it } from "vitest";
import { behavesLikeConcept } from "./behavesLikeConcept.js";
import { expectConcept } from "./expectConcept.js";

export function behavesLikeUnescoThesaurusConcept10<
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
>(
  kosFactory: (
    includeLanguageTag: LanguageTag,
  ) => Kos<ConceptT, ConceptSchemeT, LabelT>,
) {
  const testConcept = async (includeLanguageTag: LanguageTag) =>
    kosFactory(includeLanguageTag)
      .conceptByIdentifier(
        DataFactory.namedNode(
          "http://vocabularies.unesco.org/thesaurus/concept10",
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
    for (const inSchemes of [
      [...(await concept.topConceptOf())],
      [...(await concept.inSchemes())],
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
    const concept = await testConcept("en");
    expect(concept.modified.extractNullable()?.value).toStrictEqual(
      "2019-12-15T13:26:49Z",
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptEn = await testConcept("en");
    const conceptFr = await testConcept("fr");

    const enPrefLabels = conceptEn.labels({ types: [Label.Type.PREFERRED] });
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual(
      "Right to education",
    );

    const frPrefLabels = conceptFr.labels({ types: [Label.Type.PREFERRED] });
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Droit à l'éducation",
    );
  });

  it("should be a top concept of the single concept scheme", async () => {
    const concept = await testConcept("en");
    const topConceptOf = [...(await concept.topConceptOf())];
    expect(topConceptOf).toHaveLength(1);
    expect(
      topConceptOf[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have known semantic relations (direct only)", async () => {
    const concept = await testConcept("en");
    for (const { semanticRelationProperty, conceptNumbers } of [
      {
        semanticRelationProperty: SemanticRelation.Type.NARROWER,
        conceptNumbers: [4938, 7597],
      },
      {
        semanticRelationProperty: SemanticRelation.Type.RELATED,
        conceptNumbers: [9, 556, 557, 1519, 5052],
      },
    ]) {
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

  it("should have known semantic relations (direct and inverse)", async () => {
    const concept = await testConcept("en");
    for (const { semanticRelationProperty, conceptNumbers } of [
      {
        semanticRelationProperty: SemanticRelation.Type.NARROWER,
        conceptNumbers: [4938, 7597],
      },
      {
        semanticRelationProperty: SemanticRelation.Type.RELATED,
        conceptNumbers: [9, 556, 557, 1519, 5052],
      },
    ]) {
      const semanticRelations = [
        ...(await concept.semanticRelations(semanticRelationProperty, {
          includeInverse: true,
        })),
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

  behavesLikeConcept(testConcept);
}
