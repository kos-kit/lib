import ParsingSparqlClient from "sparql-http-client/ParsingClient";
import { SparqlClient } from "./SparqlClient";

export class HttpSparqlClient
  extends ParsingSparqlClient
  implements SparqlClient {}
