import { LanguageTagSet } from "@kos-kit/models";
import {
  ConstructQueryBuilder,
  GraphPatternObject,
  GraphPatternSubject,
} from "../src";
import { Concept } from "../src/Concept";
import { skos } from "@tpluscode/rdf-ns-builders";
import { describe, expect, it } from "vitest";

describe("ConstructQueryBuilder", () => {
  const subject: GraphPatternSubject = {
    termType: "NamedNode",
    value: "http://example.com/concept",
  };
  const predicate = skos.prefLabel;
  const object: GraphPatternObject = {
    termType: "Variable",
    value: "prefLabel",
  };

  it("should translate a single required pattern", () => {
    expect(
      new ConstructQueryBuilder()
        .addGraphPatterns({
          subject,
          predicate,
          object,
          optional: false,
        })
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
        .addGraphPatterns({
          subject,
          predicate,
          object,
          optional: true,
        })
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
        .addGraphPatterns({
          subject,
          predicate,
          object: { ...object, plainLiteral: true },
          optional: false,
        })
        .build(),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
  FILTER (!BOUND(?${object.value}) || LANG(?${object.value}) = "en" || LANG(?${object.value}) = "" )
}`);
  });

  it("should translate a conceptByIdentifier query", () => {
    const subject: GraphPatternSubject = {
      termType: "NamedNode",
      value: "http://example.com/concept",
    };
    const actual = new ConstructQueryBuilder()
      .addGraphPatterns(
        ...Concept.propertyGraphPatterns({
          subject,
          variablePrefix: "concept",
        }),
      )
      .build();
    // console.log("\n", actual);
    expect(actual).not.toHaveLength(0);
  });
});
