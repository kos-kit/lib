import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataFactory, Store } from "n3";
import { describe, expect, it } from "vitest";
import { parseRdfFile } from "../parseRdfFile.js";

describe("parseRdfFile", () => {
  const testDataDirPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "..",
    "__tests__",
    "data",
  );
  for (const fileName of fs.readdirSync(testDataDirPath)) {
    if (fileName.startsWith("unesco-thesaurus")) {
      it(`should parse ${fileName}`, async () => {
        const dataset = new Store();
        await parseRdfFile({
          dataFactory: DataFactory,
          dataset,
          rdfFilePath: path.resolve(testDataDirPath, fileName),
        });
        expect(dataset.size).toBe(88482);
      });
    } else if (fileName === "place.jsonld") {
      it(`should parse ${fileName}`, async () => {
        const dataset = new Store();
        await parseRdfFile({
          dataFactory: DataFactory,
          dataset,
          rdfFilePath: path.resolve(testDataDirPath, fileName),
        });
        expect(dataset.size).toBe(6);
      });
    }
  }
});
