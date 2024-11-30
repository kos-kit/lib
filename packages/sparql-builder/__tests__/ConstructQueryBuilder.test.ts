import { skos } from "@tpluscode/rdf-ns-builders";
import { describe, expect, it } from "vitest";
import { ConstructQueryBuilder } from "../ConstructQueryBuilder.js";
import { GraphPattern } from "../GraphPattern.js";

describe("ConstructQueryBuilder", () => {
  const subject = {
    termType: "NamedNode" as const,
    value: "http://example.com/concept",
  };
  const predicate = skos.prefLabel;
  const object = GraphPattern.variable("prefLabel");

  it("should translate a single required pattern", () => {
    expect(
      new ConstructQueryBuilder()
        .addGraphPattern(GraphPattern.basic(subject, predicate, object))
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
        .addGraphPattern(
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
        includeLanguageTags: ["en", ""],
      })
        .addGraphPattern(
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
