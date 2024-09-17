import { Maybe } from "purify-ts";
import { CompressionMethod } from "./CompressionMethod.js";
import { RdfFormat } from "./RdfFormat.js";

export interface RdfFileFormat {
  compressionMethod: Maybe<CompressionMethod>;
  rdfFormat: RdfFormat;
}
