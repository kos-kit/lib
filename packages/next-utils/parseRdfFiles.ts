import { DatasetCore } from "@rdfjs/types";
import { Store } from "n3";
import { parseRdfFile } from "./parseRdfFile.js";

export async function parseRdfFiles(
  rdfFilePaths: readonly string[],
  intoDataset?: DatasetCore,
): Promise<DatasetCore> {
  const intoDataset_ = intoDataset ?? new Store();
  await Promise.all(
    rdfFilePaths.map((rdfFilePath) => parseRdfFile(rdfFilePath)),
  );
  return intoDataset_;
}
