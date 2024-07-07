import { describe, expect, it } from "vitest";
import { isRdfFile } from "../isRdfFile.js";

describe("isRdfFile", () => {
  for (const rdfFileName of ["test.jsonld", "test.nt", "test.nt.br"]) {
    it(`should recognize ${rdfFileName} has an RDF file extension`, () => {
      expect(isRdfFile(rdfFileName)).toStrictEqual(true);
    });
  }

  for (const rdfFileName of ["test.json", "test.nt.whatever", "test.doc"]) {
    it(`should recognize ${rdfFileName} does not have RDF file extension`, () => {
      expect(isRdfFile(rdfFileName)).toStrictEqual(false);
    });
  }
});
