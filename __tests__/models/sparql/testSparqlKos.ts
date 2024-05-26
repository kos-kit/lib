import { QueryEngine } from "@comunica/query-sparql-rdfjs";
import { testDataset } from "../../testDataset";
import { SparqlKos } from "../../../src/models/sparql/SparqlKos";

export const testSparqlKos = new SparqlKos(
  {
    sources: [testDataset],
  },
  new QueryEngine(),
);
