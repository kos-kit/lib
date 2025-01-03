import { rdf, schema } from "@tpluscode/rdf-ns-builders";
import { describe, it } from "vitest";
import { GraphPattern } from "../GraphPattern.js";
import { testGraphPattern } from "./testGraphPattern.js";

describe("GraphPattern", () => {
  it("should match a single graph pattern", () => {
    testGraphPattern(
      `<${schema.name.value}> <${rdf.type.value}> <${rdf.Property.value}> .`,
      GraphPattern.basic(schema.name, rdf.type, rdf.Property),
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
