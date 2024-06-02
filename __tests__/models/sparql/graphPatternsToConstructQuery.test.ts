import { DataFactory } from "n3";
import { graphPatternsToConstructQuery } from "../../../src/models/sparql";
import { skos } from "../../../src/vocabularies";

describe("graphPatternsToConstructQuery", () => {
  it("should translate a single optional pattern", () => {
    expect(
      graphPatternsToConstructQuery([
        {
          subject: DataFactory.namedNode("http://example.com/concept"),
          predicate: skos.prefLabel,
          object: DataFactory.variable("prefLabel"),
          optional: true,
        },
      ]),
    ).toStrictEqual(`\
CONSTRUCT blah
`);
  });
});
