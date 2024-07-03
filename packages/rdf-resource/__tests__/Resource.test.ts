import { beforeAll, describe, expect, it } from "vitest";
import { DataFactory, Store } from "n3";
import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Resource } from "..";
import { xsd } from "@tpluscode/rdf-ns-builders";

describe("Resource", () => {
  let resource: Resource;

  const objects: Record<string, BlankNode | Literal | NamedNode> = {
    blankNode: DataFactory.blankNode(),
    booleanLiteral: DataFactory.literal(1, xsd.boolean),
    intLiteral: DataFactory.literal(1),
    namedNode: DataFactory.namedNode("http://example.com/namedNodeObject"),
    stringLiteral: DataFactory.literal("stringLiteralObject"),
  };

  const predicate = DataFactory.namedNode(`http://example.com/predicate`);

  beforeAll(() => {
    const dataset: DatasetCore = new Store();
    const resourceBuilder = new Resource.Builder({
      dataFactory: DataFactory,
      dataset,
      identifier: DataFactory.namedNode("http://example.com/subject"),
    });
    for (const object of Object.values(objects)) {
      resourceBuilder.add(predicate, object);
    }
    resource = resourceBuilder.build();
  });

  it("should get an optional value", () => {
    expect(
      resource
        .optionalValue<
          BlankNode | Literal | NamedNode
        >(DataFactory.namedNode("http://example.com/nonexistent"), Resource.ValueMappers.identity)
        .extract(),
    ).toBeUndefined();

    expect(
      resource.optionalValue(predicate, Resource.ValueMappers.iri).extract()
        ?.value,
    ).toStrictEqual(objects["namedNode"].value);
  });

  it("should get a required value", () => {
    expect(() =>
      resource.requiredValue<BlankNode | Literal | NamedNode>(
        DataFactory.namedNode("http://example.com/nonexistent"),
        Resource.ValueMappers.identity,
      ),
    ).toThrowError();

    expect(
      resource.requiredValue(predicate, Resource.ValueMappers.iri).value,
    ).toBe(objects["namedNode"].value);
  });

  it("should get all values", () => {
    const values = [
      ...resource.values<BlankNode | Literal | NamedNode>(
        predicate,
        Resource.ValueMappers.identity,
      ),
    ];
    expect(values).toHaveLength(Object.keys(objects).length);
    for (const object of Object.values(objects)) {
      expect(values.find((value) => value.equals(object))).toBeDefined();
    }
  });

  it("should get identifier values", () => {
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.identifier),
    ];
    expect(values).toHaveLength(2);
    expect(
      values.find((value) => value.equals(objects["blankNode"])),
    ).toBeDefined();
    expect(
      values.find((value) => value.equals(objects["namedNode"])),
    ).toBeDefined();
  });

  it("should get resource values", () => {
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.resource),
    ];
    expect(values).toHaveLength(2);
    expect(
      values.find((value) => value.identifier.equals(objects["blankNode"])),
    ).toBeDefined();
    expect(
      values.find((value) => value.identifier.equals(objects["namedNode"])),
    ).toBeDefined();
  });

  it("should set with the builder", () => {
    const dataset = new Store();
    const resourceBuilder = new Resource.Builder({
      dataFactory: DataFactory,
      dataset,
      identifier: DataFactory.blankNode(),
    });
    resourceBuilder.add(predicate, objects["stringLiteral"]);
    expect(dataset.size).toStrictEqual(1);
    resourceBuilder.set(predicate, objects["intLiteral"]);
    expect(dataset.size).toStrictEqual(1);
    const resource = resourceBuilder.build();
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.identity),
    ];
    expect(values).toHaveLength(1);
    expect(values[0].equals(objects["intLiteral"])).toBeTruthy();
  });
});
