import { beforeAll, describe, expect, it } from "vitest";
import { DataFactory, Store } from "n3";
import { DatasetCore, Quad, Quad_Object, Variable } from "@rdfjs/types";
import { MutableResource } from "..";
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
      mutateGraph: DataFactory.defaultGraph(),
    });
    for (const object of Object.values(objects)) {
      resource.add(predicate, object);
    }
  });

  it("should get a value (missing)", () => {
    expect(
      resource
        .value(DataFactory.namedNode("http://example.com/nonexistent"))
        .toTerm()
        .extract(),
    ).toBeUndefined();
  });

  it("should get a value (present)", () => {
    expect(
      [...resource.values(predicate)]
        .filter((value) => value.isIri())
        .at(0)
        ?.toIri()
        .extract()?.value,
    ).toStrictEqual(objects["namedNode"].value);
  });

  it("should get all values", () => {
    const values = [...resource.values(predicate)];
    expect(values).toHaveLength(Object.keys(objects).length);
    for (const object of Object.values(objects)) {
      expect(
        values.find((value) => value.toTerm().extract()?.equals(object)),
      ).toBeDefined();
    }
  });

  it("should get identifier values", () => {
    const values = [...resource.values(predicate)].flatMap((value) =>
      value.toIdentifier().toList(),
    );
    expect(values).toHaveLength(2);
    expect(
      values.find((value) => value.equals(objects["blankNode"])),
    ).toBeDefined();
    expect(
      values.find((value) => value.equals(objects["namedNode"])),
    ).toBeDefined();
  });

  it("should get resource values", () => {
    const values = [...resource.values(predicate)].flatMap((value) =>
      value.toResource().toList(),
    );
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
      mutateGraph: DataFactory.defaultGraph(),
    });
    resource.add(predicate, objects["stringLiteral"]);
    expect(dataset.size).toStrictEqual(1);
    resource.set(predicate, objects["intLiteral"]);
    expect(dataset.size).toStrictEqual(1);
    const values = [...resource.values(predicate)].flatMap((value) =>
      value.toTerm().toList(),
    );
    expect(values).toHaveLength(1);
    expect(values[0].equals(objects["intLiteral"])).toBe(true);
  });

  it("should get a valueOf", () => {
    const resourceValues = [...resource.values(predicate)].flatMap((value) =>
      value.toResource().toList(),
    );
    expect(resourceValues).toHaveLength(2);
    for (const resourceValue of resourceValues) {
      expect(
        resourceValue
          .valueOf(predicate)
          .unsafeCoerce()
          .identifier.equals(resource.identifier),
      ).toBe(true);
    }
  });

  it("should get a valuesOf", () => {
    const resourceValues = [...resource.values(predicate)].flatMap((value) =>
      value.toResource().toList(),
    );
    expect(resourceValues).toHaveLength(2);
    for (const resourceValue of resourceValues) {
      const valuesOf = [...resourceValue.valuesOf(predicate)];
      expect(valuesOf).toHaveLength(1);
      expect(valuesOf[0].identifier.equals(resource.identifier)).toBe(true);
    }
  });
});
