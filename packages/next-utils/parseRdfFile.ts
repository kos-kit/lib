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
import * as jsonld from "jsonld";
import N3 from "n3";
import bz2 from "unbzip2-stream";
import { RdfFileFormat } from "./RdfFileFormat.js";
import { getRdfFileFormat } from "./getRdfFileFormat.js";

function addQuad({
  dataFactory,
  dataset,
  graph,
  quad,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  graph?: Exclude<Quad_Graph, Variable>;
  quad: Quad;
}) {
  if (graph && quad.graph.equals(dataFactory.defaultGraph())) {
    // The quad is probably a triple, add it to the specified graph.
    dataset.add(
      dataFactory.quad(quad.subject, quad.predicate, quad.object, graph),
    );
  } else {
    // Add the quad as-is.
    dataset.add(quad);
  }
}

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

  switch (rdfFileFormat.rdfFormat) {
    case "application/ld+json":
      await parseRdfFileWithJsonLd({
        dataFactory,
        dataset,
        graph,
        rdfFileStream,
      });
      break;
    case "application/n-quads":
    case "application/n-triples":
    case "application/trig":
    case "text/turtle":
      await parseRdfFileWithN3({
        dataFactory,
        dataset,
        graph,
        rdfFileStream,
      });
      break;
    case "application/rdf+xml":
      throw new Error(`format not supported: ${rdfFileFormat.rdfFormat}`);
  }

  return dataset;
}

async function parseRdfFileWithJsonLd({
  dataFactory,
  dataset,
  graph,
  rdfFileStream,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  graph?: Exclude<Quad_Graph, Variable>;
  rdfFileStream: Readable;
}): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of rdfFileStream) {
    chunks.push(Buffer.from(chunk));
  }
  const jsonString = Buffer.concat(chunks).toString("utf-8");
  const json = JSON.parse(jsonString);

  const quads: any = await jsonld.toRDF(json);
  for (const quad of quads) {
    addQuad({ dataFactory, dataset, graph, quad });
  }
}

async function parseRdfFileWithN3({
  dataFactory,
  dataset,
  graph,
  rdfFileStream,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  graph?: Exclude<Quad_Graph, Variable>;
  rdfFileStream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new N3.StreamParser({ factory: dataFactory });
    streamParser.on("data", (quad: Quad) => {
      addQuad({ dataFactory, dataset, graph, quad });
    });
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}
