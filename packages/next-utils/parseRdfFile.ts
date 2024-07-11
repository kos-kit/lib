import {
  DataFactory,
  DatasetCore,
  Quad,
  Quad_Graph,
  Variable,
} from "@rdfjs/types";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import bz2 from "unbzip2-stream";
import N3 from "n3";

export function parseRdfFile({
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

    const streamParser = new N3.StreamParser({ factory: dataFactory });
    const defaultGraph = dataFactory.defaultGraph();
    streamParser.on("data", (quad: Quad) => {
      if (graph && quad.graph.equals(defaultGraph)) {
        // The quad is probably a triple, add it to the specified graph.
        dataset.add(
          dataFactory.quad(quad.subject, quad.predicate, quad.object, graph),
        );
      } else {
        // Add the quad as-is.
        dataset.add(quad);
      }
    });
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve(dataset);
    });
    streamParser.on("error", reject);
    rdfFileStream.pipe(streamParser);
  });
}
