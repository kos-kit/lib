import { DatasetCore } from "@rdfjs/types";
import { parseRdfFile } from "./parseRdfFile.js";

export async function parseRdfFiles(
  rdfFilePaths: readonly string[],
  intoDataset: DatasetCore,
): Promise<DatasetCore> {
  await Promise.all(
    rdfFilePaths.map((rdfFilePath) => parseRdfFile(rdfFilePath, intoDataset)),
  );
  return intoDataset;
}
