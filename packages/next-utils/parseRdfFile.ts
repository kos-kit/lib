import fs from "node:fs";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import { DataFactory, DatasetCore } from "@rdfjs/types";
import { JsonLdParser } from "jsonld-streaming-parser";
import N3 from "n3";
import bz2 from "unbzip2-stream";
import { RdfFileFormat } from "./RdfFileFormat.js";

export async function parseRdfFile({
  dataFactory,
  dataset,
  rdfFileFormat,
  rdfFilePath,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  rdfFileFormat: RdfFileFormat;
  rdfFilePath: string;
}): Promise<DatasetCore> {
  let rdfFileStream: Readable = fs.createReadStream(rdfFilePath);

  if (rdfFileFormat.compressionMethod.isJust()) {
    switch (rdfFileFormat.compressionMethod.unsafeCoerce()) {
      case "application/gzip":
        rdfFileStream = rdfFileStream.pipe(zlib.createGunzip());
        break;
      case "application/x-brotli":
        rdfFileStream = rdfFileStream.pipe(zlib.createBrotliDecompress());
        break;
      case "application/x-bzip2":
        rdfFileStream = rdfFileStream.pipe(bz2());
        break;
    }
  }

  switch (rdfFileFormat.rdfFormat) {
    case "application/ld+json":
      await parseJsonLdFile({
        dataFactory,
        dataset,
        rdfFileStream,
      });
      break;
    case "application/n-quads":
    case "application/n-triples":
    case "application/trig":
    case "text/turtle":
      await parseN3File({
        dataFactory,
        dataset,
        rdfFileStream,
      });
      break;
    case "application/rdf+xml":
      throw new Error(`format not supported: ${rdfFileFormat.rdfFormat}`);
  }

  return dataset;
}

async function parseJsonLdFile({
  dataFactory,
  dataset,
  rdfFileStream,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  rdfFileStream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new JsonLdParser({ dataFactory });
    streamParser.on("data", (quad) => {
      dataset.add(quad);
    });
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}

async function parseN3File({
  dataFactory,
  dataset,
  rdfFileStream,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  rdfFileStream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new N3.StreamParser({ factory: dataFactory });
    streamParser.on("data", (quad) => {
      dataset.add(quad);
    });
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}
