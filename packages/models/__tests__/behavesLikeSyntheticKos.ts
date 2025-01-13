import { DataFactory } from "n3";
import { it } from "vitest";
import { Kos, LanguageTag } from "../index.js";

export const behavesLikeSyntheticKos = (
  kosFactory: (languageIn: LanguageTag) => Kos,
) => {
  const kos = kosFactory("en");
  const conceptIdentifier = DataFactory.namedNode(
    "http://example.com/synthetic/concept",
  );
  const conceptSchemeIdentifier = DataFactory.namedNode(
    "http://example.com/synthetic/conceptScheme",
  );

  it("Synthetic KOS: concept scheme SKOS prefLabel", async ({ expect }) => {
    const conceptScheme = (
      await kos.conceptScheme(conceptSchemeIdentifier)
    ).unsafeCoerce();
    expect(conceptScheme.prefLabel).toHaveLength(1);
    expect(conceptScheme.prefLabel[0].value).toStrictEqual("Concept scheme");
  });

  it("Synthetic KOS: concept SKOS-XL prefLabel", async ({ expect }) => {
    const concept = (await kos.concept(conceptIdentifier)).unsafeCoerce();
    expect(concept.prefLabelXl).toHaveLength(1);
    expect(concept.prefLabelXl[0].literalForm).toHaveLength(1);
    expect(concept.prefLabelXl[0].literalForm[0].value).toStrictEqual(
      "Concept",
    );
  });

  it("Synthetic KOS: semantically-related concept stub without label", async ({
    expect,
  }) => {
    const concept = (await kos.concept(conceptIdentifier)).unsafeCoerce();
    expect(concept.related).toHaveLength(1);
    const relatedConceptStub = concept.related[0];
    expect(relatedConceptStub.prefLabel).toHaveLength(0);
    expect(relatedConceptStub.prefLabelXl).toHaveLength(0);
    expect(
      relatedConceptStub.identifier.equals(
        DataFactory.namedNode("http://example.com/synthetic/danglingConcept"),
      ),
    );
  });
};
