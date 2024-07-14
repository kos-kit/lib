import { DataFactory, Parser, Store } from "n3";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { describe, expect, it } from "vitest";
import { isRdfList } from "../isRdfList.js";
import { rdf } from "@tpluscode/rdf-ns-builders";

describe("isRdfList", () => {
  const subject = DataFactory.namedNode("urn:example:subject");
  const predicate = DataFactory.namedNode("urn:example:predicate");

  const parseAndTest = (ttl: string): boolean => {
    const dataset = new Store();
    dataset.addQuads(new Parser({ format: "Turtle" }).parse(ttl));
    const node = [...dataset.match(subject, predicate, null, null)][0]
      .object as BlankNode | NamedNode;
    return isRdfList({ dataset, node });
  };

  for (const negativeCase of [
    `<${subject.value}> <${predicate.value}> "test" .`,
    `<${subject.value}> <${predicate.value}> <http://example.com/bogus> . <http://example.com/bogus> <${rdf.first.value}> "whatever" .`,
    `<${subject.value}> <${predicate.value}> <http://example.com/bogus> . <http://example.com/bogus> <${rdf.first.value}> "first" . <http://example.com/bogus> <${rdf.rest.value}> "rest" .`,
    `<${subject.value}> <${predicate.value}> <http://example.com/bogus> . <http://example.com/bogus> <${rdf.first.value}> <http://example/head> . <http://example.com/bogus> <${rdf.first.value}> <http://example.com/head2> .`,
  ]) {
    it("should recognize a negative case", () => {
      expect(parseAndTest(negativeCase)).toStrictEqual(false);
    });
  }

  for (const positiveCase of [
    `<${subject.value}> <${predicate.value}> ( ) .`,
    `<${subject.value}> <${predicate.value}> ( "test" ) .`,
    `<${subject.value}> <${predicate.value}> ( "test" "test2" ) .`,
    `<${subject.value}> <${predicate.value}> ( [ ] [ ] ) .`,
  ]) {
    it("should recognize a positive case", () => {
      expect(parseAndTest(positiveCase)).toStrictEqual(true);
    });
  }
});
