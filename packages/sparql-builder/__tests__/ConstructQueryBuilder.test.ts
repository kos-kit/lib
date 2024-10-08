import { LanguageTagSet } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { describe, expect, it } from "vitest";
import { BasicGraphPattern, ConstructQueryBuilder, GraphPattern } from "..";

describe("ConstructQueryBuilder", () => {
  const subject: BasicGraphPattern.Subject = {
    termType: "NamedNode",
    value: "http://example.com/concept",
  };
  const predicate = skos.prefLabel;
  const object: BasicGraphPattern.Object = {
    termType: "Variable",
    value: "prefLabel",
  };

  it("should translate a single required pattern", () => {
    expect(
      new ConstructQueryBuilder()
        .addGraphPatterns(GraphPattern.basic(subject, predicate, object))
        .build(),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
}`);
  });

  it("should translate a single optional pattern", () => {
    expect(
      new ConstructQueryBuilder()
        .addGraphPatterns(
          GraphPattern.optional(GraphPattern.basic(subject, predicate, object)),
        )
        .build(),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  OPTIONAL {
    <${subject.value}> <${predicate.value}> ?${object.value} .
  }
}`);
  });

  it("should translate a filter", () => {
    expect(
      new ConstructQueryBuilder({
        includeLanguageTags: new LanguageTagSet("en", ""),
      })
        .addGraphPatterns(
          GraphPattern.basic(subject, predicate, {
            ...object,
            plainLiteral: true,
          }),
        )
        .build(),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
  FILTER (!BOUND(?${object.value}) || LANG(?${object.value}) = "en" || LANG(?${object.value}) = "" )
}`);
  });
});
