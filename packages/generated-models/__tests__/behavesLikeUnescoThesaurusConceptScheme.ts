import { DataFactory } from "n3";
import { expect, it } from "vitest";
import { Kos, LanguageTag } from "../index.js";

export const behavesLikeUnescoThesaurusConceptScheme = (
  kosFactory: (languageIn: LanguageTag) => Kos,
) => {
  const testConceptScheme = (languageIn: LanguageTag) =>
    kosFactory(languageIn)
      .conceptScheme(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      )
      .then((conceptScheme) => conceptScheme.unsafeCoerce());

  it("UNESCO thesaurus concept scheme: should have a modified date", async () => {
    const conceptScheme = await testConceptScheme("en");
    expect(conceptScheme.modified.extract()?.getTime()).toStrictEqual(
      Date.parse("2024-03-25T14:24:28.295+01:00"),
    );
  });

  it("UNESCO thesaurus concept scheme: should have a license", async () => {
    const conceptScheme = await testConceptScheme("en");
    const license = conceptScheme.license.extract();
    expect(license).toBeDefined();
    expect(license?.termType).toStrictEqual("NamedNode");
    expect(license?.value).toStrictEqual(
      "http://creativecommons.org/licenses/by-sa/3.0/igo/",
    );
  });

  it("UNESCO thesaurus concept scheme: should have multiple prefLabels", async () => {
    const conceptSchemeEn = await testConceptScheme("en");
    const conceptSchemeFr = await testConceptScheme("fr");

    const enPrefLabels = conceptSchemeEn.prefLabel;
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].value).toStrictEqual("UNESCO Thesaurus");

    const frPrefLabels = conceptSchemeFr.prefLabel;
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].value).toStrictEqual("Thésaurus de l'UNESCO");
  });

  it("UNESCO thesaurus concept scheme: should have rights", async () => {
    const conceptScheme = await testConceptScheme("en");
    const rights = conceptScheme.rights.extract();
    expect(rights).toBeDefined();
    expect(rights?.value).toStrictEqual("CC-BY-SA");
  });

  it("UNESCO thesaurus concept scheme: should have a rights holder", async () => {
    const conceptScheme = await testConceptScheme("en");
    const rightsHolder = conceptScheme.rightsHolder.extract();
    expect(rightsHolder).toBeDefined();
    expect(rightsHolder?.value).toStrictEqual("UNESCO");
  });
};
