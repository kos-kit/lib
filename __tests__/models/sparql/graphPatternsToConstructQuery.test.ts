import { LanguageTagSet } from "../../../src/models/LanguageTagSet";
import { graphPatternsToConstructQuery } from "../../../src/models/sparql";
import { skos } from "../../../src/vocabularies";

describe("graphPatternsToConstructQuery", () => {
  const subject: { termType: "NamedNode"; value: string } = {
    termType: "NamedNode",
    value: "http://example.com/concept",
  };
  const predicate = skos.prefLabel;
  const object: { termType: "Variable"; value: string } = {
    termType: "Variable",
    value: "prefLabel",
  };

  it("should translate a single required pattern", () => {
    expect(
      graphPatternsToConstructQuery([
        {
          subject,
          predicate,
          object,
          optional: false,
        },
      ]),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
}`);
  });

  it("should translate a single optional pattern", () => {
    expect(
      graphPatternsToConstructQuery([
        {
          subject,
          predicate,
          object,
          optional: true,
        },
      ]),
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
      graphPatternsToConstructQuery(
        [
          {
            subject,
            predicate,
            object: { ...object, plainLiteral: true },
            optional: false,
          },
        ],
        { includeLanguageTags: new LanguageTagSet("en", "") },
      ),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
  FILTER (!BOUND(?${object.value}) || LANG(?${object.value}) = "en" || LANG(?${object.value}) = "" )
}`);
  });
});
