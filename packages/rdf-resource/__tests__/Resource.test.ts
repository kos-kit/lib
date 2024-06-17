import { describe, expect, it } from "vitest";
import { DataFactory, Store } from "n3";
import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Resource } from "../src";

describe("Resource", () => {
  const dataset: DatasetCore = new Store();
  const subject = DataFactory.namedNode("http://example.com/subject");
  const predicate = DataFactory.namedNode("http://example.com/predicate");
  const blankNodeObject = DataFactory.blankNode();
  const literalObject = DataFactory.literal("literal");
  const namedNodeObject = DataFactory.namedNode("http://example.com/object");
  dataset.add(DataFactory.quad(subject, predicate, blankNodeObject));
  dataset.add(DataFactory.quad(subject, predicate, literalObject));
  dataset.add(DataFactory.quad(subject, predicate, namedNodeObject));
  const resource = new Resource({ dataset, identifier: subject });

  it("should get an optional value", () => {
    expect(
      resource.optionalValue<BlankNode | Literal | NamedNode>(
        DataFactory.namedNode("http://example.com/nonexistent"),
        Resource.ValueMappers.identity,
      ),
    ).toBeNull();

    expect(
      resource.optionalValue(predicate, Resource.ValueMappers.literal)!.value,
    ).toBe(literalObject.value);
  });

  it("should get a required value", () => {
    expect(() =>
      resource.requiredValue<BlankNode | Literal | NamedNode>(
        DataFactory.namedNode("http://example.com/nonexistent"),
        Resource.ValueMappers.identity,
      ),
    ).toThrowError();

    expect(
      resource.requiredValue(predicate, Resource.ValueMappers.iri)!.value,
    ).toBe(namedNodeObject.value);
  });

  it("should get all values", () => {
    const values = [
      ...resource.values<BlankNode | Literal | NamedNode>(
        predicate,
        Resource.ValueMappers.identity,
      ),
    ];
    expect(values).toHaveLength(3);
    expect(values.find((value) => value.equals(blankNodeObject))).toBeDefined();
    expect(values.find((value) => value.equals(literalObject))).toBeDefined();
    expect(values.find((value) => value.equals(namedNodeObject))).toBeDefined();
  });

  it("should get identifier values", () => {
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.identifier),
    ];
    expect(values).toHaveLength(2);
    expect(values.find((value) => value.equals(blankNodeObject))).toBeDefined();
    expect(values.find((value) => value.equals(namedNodeObject))).toBeDefined();
  });

  it("should get resource values", () => {
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.resource),
    ];
    expect(values).toHaveLength(2);
    expect(
      values.find((value) => value.identifier.equals(blankNodeObject)),
    ).toBeDefined();
    expect(
      values.find((value) => value.identifier.equals(namedNodeObject)),
    ).toBeDefined();
  });
});
