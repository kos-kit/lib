import { rdf, rdfs, schema } from "@tpluscode/rdf-ns-builders";
import { describe, it } from "vitest";
import { GraphPattern } from "../GraphPattern";
import { testGraphPattern } from "./testGraphPattern";

describe("BasicGraphPattern", () => {
  it("should match a single graph pattern", () => {
    testGraphPattern(
      `<${schema.name.value}> <${rdf.type.value}> <${rdfs.Class.value}> .`,
      GraphPattern.basic(schema.name, rdf.type, rdfs.Class),
    );
  });

  it("should match one of two graph patterns", () => {
    testGraphPattern(
      `<${schema.name.value}> <${rdf.type.value}> <${rdf.Property.value}> . <${schema.address.value}> <${rdf.type.value}> <${rdf.Property.value}> .`,
      GraphPattern.basic(schema.name, rdf.type, rdf.Property),
      {
        expectedOutputTtl: `<${schema.name.value}> <${rdf.type.value}> <${rdf.Property.value}> .`,
      },
    );
  });
});
