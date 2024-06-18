import { DataFactory, Parser, Store } from "n3";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { list } from "..";
import { describe, expect, it } from "vitest";

describe("list", () => {
  const subject = DataFactory.namedNode("urn:example:subject");
  const predicate = DataFactory.namedNode("urn:example:predicate");

  const parseAndReadRdfList = (ttl: string) => {
    const parser = new Parser({ format: "Turtle" });
    const dataset = new Store();
    dataset.addQuads(parser.parse(ttl));
    return list({
      dataset,
      node: [...dataset.match(subject, predicate, null, null)][0].object as
        | BlankNode
        | NamedNode,
    });
  };

  it("should read an empty list", async () => {
    expect(
      parseAndReadRdfList(`<${subject.value}> <${predicate.value}> ( ) .`),
    ).toHaveLength(0);
  });

  it("should read a list with one literal", async () => {
    const list = parseAndReadRdfList(
      `<${subject.value}> <${predicate.value}> ( "test" ) .`,
    );
    expect(list).toHaveLength(1);
    expect(list[0].value).toStrictEqual("test");
  });

  it("should read a list with two literals", async () => {
    const list = parseAndReadRdfList(
      `<${subject.value}> <${predicate.value}> ( "test" "test2" ) .`,
    );
    expect(list).toHaveLength(2);
    expect(list[0].value).toStrictEqual("test");
    expect(list[1].value).toStrictEqual("test2");
  });

  it("should read a list with blank nodes", async () => {
    expect(
      parseAndReadRdfList(
        `<${subject.value}> <${predicate.value}> ( [ ] [ ] ) .`,
      ),
    ).toHaveLength(2);
  });
});
