import { behavesLikeConceptScheme } from "./behavesLikeConceptScheme.js";
import { expectConceptScheme } from "./expectConceptScheme.js";
import { ConceptScheme, LanguageTag } from "..";
import { expect, it } from "vitest";

export const behavesLikeUnescoThesaurusConceptScheme = (
  lazyConceptScheme: (
    includeLanguageTag: LanguageTag,
  ) => Promise<ConceptScheme>,
) => {
  it("should satisfy basic expect", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expectConceptScheme(conceptScheme);
  });

  it("should have a modified date", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    expect(conceptScheme.modified!.value).toStrictEqual(
      "2024-03-25T14:24:28.295+01:00",
    );
  });

  it("should have a license", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    const license = conceptScheme.license;
    expect(license).toBeDefined();
    expect(license!.termType).toStrictEqual("NamedNode");
    expect(license!.value).toStrictEqual(
      "http://creativecommons.org/licenses/by-sa/3.0/igo/",
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptSchemeEn = await lazyConceptScheme("en");
    const conceptSchemeFr = await lazyConceptScheme("fr");

    const enPrefLabels = conceptSchemeEn.prefLabels;
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual("UNESCO Thesaurus");

    const frPrefLabels = conceptSchemeFr.prefLabels;
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Thésaurus de l'UNESCO",
    );
  });

  it("should have rights", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    const rights = conceptScheme.rights;
    expect(rights).toBeDefined();
    expect(rights!.value).toStrictEqual("CC-BY-SA");
  });

  it("should have a rights holder", async () => {
    const conceptScheme = await lazyConceptScheme("en");
    const rightsHolder = conceptScheme.rightsHolder;
    expect(rightsHolder).toBeDefined();
    expect(rightsHolder!.value).toStrictEqual("UNESCO");
  });

  behavesLikeConceptScheme(lazyConceptScheme);
};
