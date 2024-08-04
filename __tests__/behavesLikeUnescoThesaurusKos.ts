import {
  Concept,
  ConceptScheme,
  Kos,
  Label,
  LanguageTag,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { DataFactory } from "n3";
import { AsyncIterables } from "purify-ts-helpers";
import { it } from "vitest";
import { behavesLikeKos } from "./behavesLikeKos.js";

export const behavesLikeUnescoThesaurusKos = <
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
>(
  kosFactory: (
    includeLanguageTag: LanguageTag,
  ) => Kos<ConceptT, ConceptSchemeT, LabelT>,
) => {
  const testKos = kosFactory("en");

  it("should get the subject concepts of a semantic relation", async ({
    expect,
  }) => {
    const subjectConcepts = await AsyncIterables.toArray(
      testKos.concepts({
        query: {
          objectConceptIdentifier: DataFactory.namedNode(
            "http://vocabularies.unesco.org/thesaurus/concept10018",
          ),
          semanticRelationProperty: SemanticRelationProperty.NARROWER,
          type: "SubjectsOfSemanticRelation",
        },
      }),
    );
    expect(subjectConcepts).toHaveLength(1);
    expect(
      subjectConcepts.find((subjectConcept) =>
        subjectConcept.identifier.equals(
          DataFactory.namedNode(
            "http://vocabularies.unesco.org/thesaurus/concept197",
          ),
        ),
      ),
    ).toBeDefined;
  });

  behavesLikeKos(testKos);
};
