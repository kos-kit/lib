import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { describe, it } from "vitest";
import { RdfTypeGraphPatterns } from "../RdfTypeGraphPatterns";
import { testGraphPatterns } from "./testGraphPatterns";

describe("RdfTypeGraphPatterns", () => {
  it("should match a direct RDF type", () => {
    testGraphPatterns(
      `<http://example.com> <${rdf.type.value}> <${rdfs.Class.value}> .`,
      new RdfTypeGraphPatterns(
        {
          termType: "NamedNode",
          value: "http://example.com",
          variablePrefix: "example",
        },
        rdfs.Class,
      ),
    );
  });

  it("should match an indirect direct RDF type", () => {
    testGraphPatterns(
      `<http://example.com> <${rdf.type.value}> <http://example.com/class> . <http://example.com/class> <${rdfs.subClassOf.value}> <${rdfs.Class.value}> .`,
      new RdfTypeGraphPatterns(
        {
          termType: "NamedNode",
          value: "http://example.com",
          variablePrefix: "example",
        },
        rdfs.Class,
      ),
      {
        expectedOutputTtl: `<http://example.com> <${rdf.type.value}> <http://example.com/class> .`,
      },
    );
  });
});
