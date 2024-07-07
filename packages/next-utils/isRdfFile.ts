import * as path from "node:path";

export function isRdfFile(rdfFilePath: string): boolean {
  const rdfFileName = path.basename(rdfFilePath);
  const rdfFileExt = path.extname(rdfFileName);
  switch (rdfFileExt.toLowerCase()) {
    case ".br":
    case ".bz2":
    case ".gz":
      return isRdfFile(path.basename(rdfFileName, rdfFileExt));
    // Subset of extensions from https://www.npmjs.com/package/rdf-parse
    // No .html variants
    // No .json
    case ".jsonld":
    case ".n3":
    case ".nq":
    case ".nquads":
    case ".nt":
    case ".ntriples":
    case ".owl":
    case ".rdf":
    case ".rdfxml":
    case ".trig":
    case ".ttl":
    case ".turtle":
      return true;
    default:
      return false;
  }
}
