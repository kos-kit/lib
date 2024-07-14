import { Store } from "oxigraph";
import { SparqlClient } from "./SparqlClient.js";
import { DatasetCore, Quad } from "@rdfjs/types";
import { ResultRow } from "sparql-http-client/ResultParser.js";
import * as OxigraphRdfjsCompat from "./OxigraphRdfjsCompat.js";

export class OxigraphSparqlClient implements SparqlClient {
  constructor(private readonly delegate: Store) {}

  readonly query: SparqlClient.Query = {
    ask: async (query: string) => this.delegate.query(query, {}),
    construct: async (query: string): Promise<DatasetCore> => {
      const quads: Quad[] = this.delegate.query(query, {});
      return new OxigraphRdfjsCompat.DatasetCore(new Store(quads));
    },
    select: async (query: string): Promise<readonly ResultRow[]> => {
      const _bindings: readonly Map<string, string>[] = this.delegate.query(
        query,
        {},
      );
      throw new Error("not implemented");
    },
  };

  readonly update: SparqlClient.Update = {
    update: async (update: string) => this.delegate.update(update, {}),
  };
}
