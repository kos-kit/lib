import { QueryEngine } from "@comunica/query-sparql-rdfjs";
import { testDataset } from "../../testDataset";
import { Kos } from "../../../src/models/sparql/Kos";

export const testKos = new Kos(
  {
    sources: [testDataset],
  },
  new QueryEngine(),
);
