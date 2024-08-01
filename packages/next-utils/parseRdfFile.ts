import fs from "node:fs";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import {
  DataFactory,
  DatasetCore,
  Quad,
  Quad_Graph,
  Variable,
} from "@rdfjs/types";
import { JsonLdParser } from "jsonld-streaming-parser";
import N3 from "n3";
import bz2 from "unbzip2-stream";
import { RdfFileFormat } from "./RdfFileFormat.js";
import { getRdfFileFormat } from "./getRdfFileFormat.js";

export async function parseRdfFile({
  dataFactory,
  dataset,
  graph,
  rdfFilePath,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  graph?: Exclude<Quad_Graph, Variable>;
  rdfFilePath: string;
}): Promise<DatasetCore> {
  const rdfFileFormatEither = getRdfFileFormat(rdfFilePath);
  if (rdfFileFormatEither.isLeft()) {
    throw rdfFileFormatEither.extract();
  }
  const rdfFileFormat = rdfFileFormatEither.extract() as RdfFileFormat;

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

  let addQuad: (quad: Quad) => void;
  if (graph) {
    switch (rdfFileFormat.rdfFormat) {
      case "application/n-triples":
      case "text/turtle":
        // Triple formats, always override the graph
        addQuad = (quad) =>
          dataset.add(
            dataFactory.quad(quad.subject, quad.predicate, quad.object, graph),
          );
        break;
      case "application/ld+json":
      case "application/n-quads":
      case "application/trig":
        // Quad formats, override the graph if the parsed quad is in the default graph
        addQuad = (quad) => {
          if (quad.graph.termType === "DefaultGraph") {
            dataset.add(
              dataFactory.quad(
                quad.subject,
                quad.predicate,
                quad.object,
                graph,
              ),
            );
          } else {
            // Add the quad as-is.
            dataset.add(quad);
          }
        };
        break;
      case "application/rdf+xml":
        throw new Error(`format not supported: ${rdfFileFormat.rdfFormat}`);
    }
  } else {
    addQuad = (quad) => dataset.add(quad);
  }

  switch (rdfFileFormat.rdfFormat) {
    case "application/ld+json":
      await parseJsonLdFile({
        addQuad,
        dataFactory,
        rdfFileStream,
      });
      break;
    case "application/n-quads":
    case "application/n-triples":
    case "application/trig":
    case "text/turtle":
      await parseN3File({
        addQuad,
        dataFactory,
        rdfFileStream,
      });
      break;
    case "application/rdf+xml":
      throw new Error(`format not supported: ${rdfFileFormat.rdfFormat}`);
  }

  return dataset;
}

async function parseJsonLdFile({
  addQuad,
  dataFactory,
  rdfFileStream,
}: {
  addQuad: (quad: Quad) => void;
  dataFactory: DataFactory;
  rdfFileStream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new JsonLdParser({ dataFactory });
    streamParser.on("data", addQuad);
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}

async function parseN3File({
  addQuad,
  dataFactory,
  rdfFileStream,
}: {
  addQuad: (quad: Quad) => void;
  dataFactory: DataFactory;
  rdfFileStream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new N3.StreamParser({ factory: dataFactory });
    streamParser.on("data", addQuad);
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}
