import { isInstanceOf } from "..";
import { describe, expect, it } from "vitest";
import { DataFactory, Store } from "n3";
import { rdf, rdfs, skos } from "@tpluscode/rdf-ns-builders";

describe("isInstanceOf", () => {
  const dataset = new Store();
  const class_ = skos.Concept;
  const classInstance = DataFactory.blankNode();
  const subClass = DataFactory.namedNode("http://example.com/ConceptSubclass");
  const subClassInstance = DataFactory.blankNode();
  dataset.addQuad(DataFactory.quad(classInstance, rdf.type, class_));
  dataset.addQuad(DataFactory.quad(subClass, rdfs.subClassOf, class_));
  dataset.addQuad(DataFactory.quad(subClassInstance, rdf.type, subClass));

  it("should find a class instance", () => {
    expect(
      isInstanceOf({
        class_,
        dataset,
        instance: classInstance,
      }),
    ).toStrictEqual(true);
  });

  it("should find a subclass instance if includeSubclasses is true", () => {
    expect(
      isInstanceOf({
        class_,
        dataset,
        instance: subClassInstance,
      }),
    ).toStrictEqual(true);
  });

  it("should not find a subclass instance if includeSubclasses is false", () => {
    expect(
      isInstanceOf({
        class_,
        dataset,
        includeSubclasses: false,
        instance: subClassInstance,
      }),
    ).toStrictEqual(false);
  });

  it("should handle the negative case", () => {
    expect(
      isInstanceOf({
        class_: subClass,
        dataset,
        instance: DataFactory.blankNode(),
      }),
    ).toStrictEqual(false);
  });
});
