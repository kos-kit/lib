import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRdfFile } from "../parseRdfFile";
import { Store } from "n3";

describe("parseRdfFile", () => {
  const testDataDirPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "..",
    "test-data",
  );
  for (const fileName of fs.readdirSync(testDataDirPath)) {
    if (fileName.startsWith("unesco-thesaurus")) {
      it(`should parse ${fileName}`, async () => {
        const dataset = await parseRdfFile(
          path.resolve(testDataDirPath, fileName),
          new Store(),
        );
        expect(dataset.size).toBe(88482);
      });
    }
  }
});
