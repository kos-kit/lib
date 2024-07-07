import { DatasetCore, Quad } from "@rdfjs/types";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import bz2 from "unbzip2-stream";
import N3 from "n3";

export function parseRdfFile(
  rdfFilePath: string,
  intoDataset: DatasetCore,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let rdfFileStream: Readable = fs.createReadStream(rdfFilePath);

    const rdfFileExt = path.extname(rdfFilePath).toLowerCase();
    switch (rdfFileExt) {
      case ".br":
        rdfFileStream = rdfFileStream.pipe(zlib.createBrotliDecompress());
        break;
      case ".bz2":
        rdfFileStream = rdfFileStream.pipe(bz2());
        break;
      case ".gz":
        rdfFileStream = rdfFileStream.pipe(zlib.createGunzip());
        break;
    }

    const streamParser = new N3.StreamParser();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    streamParser.on("data", (quad: Quad) => intoDataset.add(quad));
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}
