import { Maybe } from "purify-ts";
import { CompressionMethod } from "./CompressionMethod";
import { RdfFormat } from "./RdfFormat";

export interface RdfFileFormat {
  compressionMethod: Maybe<CompressionMethod>;
  rdfFormat: RdfFormat;
}
