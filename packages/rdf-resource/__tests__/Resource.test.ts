import { beforeAll, describe, expect, it } from "vitest";
import { DataFactory, Store } from "n3";
import { DatasetCore, Quad, Quad_Object, Variable } from "@rdfjs/types";
import { MutableResource, Resource } from "..";
import { xsd } from "@tpluscode/rdf-ns-builders";

describe("Resource", () => {
  let resource: MutableResource;

  const objects: Record<string, Exclude<Quad_Object, Quad | Variable>> = {
    blankNode: DataFactory.blankNode(),
    booleanLiteral: DataFactory.literal(1, xsd.boolean),
    intLiteral: DataFactory.literal(1),
    namedNode: DataFactory.namedNode("http://example.com/namedNodeObject"),
    stringLiteral: DataFactory.literal("stringLiteralObject"),
  };

  const predicate = DataFactory.namedNode(`http://example.com/predicate`);

  beforeAll(() => {
    const dataset: DatasetCore = new Store();
    resource = new MutableResource({
      dataFactory: DataFactory,
      dataset,
      identifier: DataFactory.namedNode("http://example.com/subject"),
    });
    for (const object of Object.values(objects)) {
      resource.add(predicate, object);
    }
  });

  it("should get a value", () => {
    expect(
      resource
        .value(
          DataFactory.namedNode("http://example.com/nonexistent"),
          Resource.ValueMappers.identity,
        )
        .extract(),
    ).toBeUndefined();

    expect(
      resource.value(predicate, Resource.ValueMappers.iri).extract()?.value,
    ).toStrictEqual(objects["namedNode"].value);
  });

  it("should get all values", () => {
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.identity),
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

  it("should set a value", () => {
    const dataset = new Store();
    const resource = new MutableResource({
      dataFactory: DataFactory,
      dataset,
      identifier: DataFactory.blankNode(),
    });
    resource.add(predicate, objects["stringLiteral"]);
    expect(dataset.size).toStrictEqual(1);
    resource.set(predicate, objects["intLiteral"]);
    expect(dataset.size).toStrictEqual(1);
    const values = [
      ...resource.values(predicate, Resource.ValueMappers.identity),
    ];
    expect(values).toHaveLength(1);
    expect(values[0].equals(objects["intLiteral"])).toBeTruthy();
  });
});
