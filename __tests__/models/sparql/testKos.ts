import { Kos } from "../../../src/models/sparql/Kos";
import SparqlClient from "sparql-http-client/ParsingClient";

export const testKos = new Kos(
  new SparqlClient({
    endpointUrl: "http://localhost:7878/sparql",
  }),
);
