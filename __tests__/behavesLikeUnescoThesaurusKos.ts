import {
  Concept,
  ConceptScheme,
  Kos,
  Label,
  LanguageTag,
} from "@kos-kit/models";
import { DataFactory } from "n3";
import { expect, it } from "vitest";
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
    const subjectConcepts = [
      ...(await testKos.concepts({
        limit: null,
        offset: 0,
        query: {
          objectConceptIdentifier: DataFactory.namedNode(
            "http://vocabularies.unesco.org/thesaurus/concept10018",
          ),
          semanticRelationType: Concept.SemanticRelation.Type.NARROWER,
          type: "SubjectsOfSemanticRelation",
        },
      })),
    ];
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

  // These get-all queries are too slow on Oxigraph
  // it(
  //   "should get all concepts",
  //   async () => {
  //     const concepts = await (
  //       await testKos.concepts({
  //         limit: null,
  //         offset: 0,
  //         query: { type: "All" },
  //       })
  //     ).flatResolve();
  //     expect(concepts).toHaveLength(4482);
  //   },
  //   { timeout: 30000 },
  // );

  // it("should get all concept schemes", async () => {
  //   const conceptSchemes = await (
  //     await testKos.conceptSchemes({
  //       limit: null,
  //       offset: 0,
  //       query: { type: "All" },
  //     })
  //   ).flatResolve();
  //   expect(conceptSchemes).toHaveLength(1);
  //   const conceptScheme = conceptSchemes[0];
  //   expect(conceptScheme.identifier.value).toStrictEqual(
  //     "http://vocabularies.unesco.org/thesaurus",
  //   );
  // });

  it("should get a count of concepts", async () => {
    expect(await testKos.conceptsCount({ type: "All" })).toStrictEqual(4482);
  });

  it("should get a count of concept schemes", async () => {
    expect(await testKos.conceptSchemesCount({ type: "All" })).toStrictEqual(1);
  });

  behavesLikeKos(testKos);
};
