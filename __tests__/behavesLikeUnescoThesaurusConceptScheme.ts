import {
  Concept,
  ConceptScheme,
  Kos,
  Label,
  LanguageTag,
} from "@kos-kit/models";
import { DataFactory } from "n3";
import { expect, it } from "vitest";
import { behavesLikeConceptScheme } from "./behavesLikeConceptScheme.js";
import { expectConceptScheme } from "./expectConceptScheme.js";

export const behavesLikeUnescoThesaurusConceptScheme = <
  ConceptT extends Concept<any, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends ConceptScheme<ConceptT, LabelT>,
  LabelT extends Label,
>(
  kosFactory: (
    includeLanguageTag: LanguageTag,
  ) => Kos<ConceptT, ConceptSchemeT, LabelT>,
) => {
  const testConceptScheme = (includeLanguageTag: LanguageTag) =>
    kosFactory(includeLanguageTag)
      .conceptSchemeByIdentifier(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      )
      .resolve()
      .then((conceptScheme) =>
        conceptScheme.orDefaultLazy(() => {
          throw new Error("missing concept scheme");
        }),
      );

  it("should satisfy basic expect", async () => {
    const conceptScheme = await testConceptScheme("en");
    expectConceptScheme(conceptScheme);
  });

  it("should have a modified date", async () => {
    const conceptScheme = await testConceptScheme("en");
    expect(conceptScheme.modified.extract()?.value).toStrictEqual(
      "2024-03-25T14:24:28.295+01:00",
    );
  });

  it("should have a license", async () => {
    const conceptScheme = await testConceptScheme("en");
    const license = conceptScheme.license.extract();
    expect(license).toBeDefined();
    expect(license?.termType).toStrictEqual("NamedNode");
    expect(license?.value).toStrictEqual(
      "http://creativecommons.org/licenses/by-sa/3.0/igo/",
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptSchemeEn = await testConceptScheme("en");
    const conceptSchemeFr = await testConceptScheme("fr");

    const enPrefLabels = conceptSchemeEn.labels(Label.Type.PREFERRED);
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual("UNESCO Thesaurus");

    const frPrefLabels = conceptSchemeFr.labels(Label.Type.PREFERRED);
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Thésaurus de l'UNESCO",
    );
  });

  it("should have rights", async () => {
    const conceptScheme = await testConceptScheme("en");
    const rights = conceptScheme.rights.extract();
    expect(rights).toBeDefined();
    expect(rights?.value).toStrictEqual("CC-BY-SA");
  });

  it("should have a rights holder", async () => {
    const conceptScheme = await testConceptScheme("en");
    const rightsHolder = conceptScheme.rightsHolder.extract();
    expect(rightsHolder).toBeDefined();
    expect(rightsHolder?.value).toStrictEqual("UNESCO");
  });

  // it("should get the subjects of a semantic relation", async () => {
  //   const objectConcept = await testConceptScheme("en");
  // });

  behavesLikeConceptScheme(testConceptScheme);
};
