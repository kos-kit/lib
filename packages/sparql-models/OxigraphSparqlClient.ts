// import { Store } from "oxigraph";
// import { SparqlClient } from "./SparqlClient.js";
// import { DatasetCore, Quad, Term } from "@rdfjs/types";
// import { ResultRow } from "sparql-http-client/ResultParser.js";
// import * as OxigraphRdfjsCompat from "./OxigraphRdfjsCompat.js";

// export class OxigraphSparqlClient implements SparqlClient {
//   constructor(private readonly delegate: Store) {}

//   readonly query: SparqlClient.Query = {
//     ask: async (query: string) => this.delegate.query(query) as boolean,
//     construct: async (query: string): Promise<DatasetCore> => {
//       return new OxigraphRdfjsCompat.DatasetCore(
//         new Store(this.delegate.query(query) as Quad[]),
//       );
//     },
//     select: async (query: string): Promise<readonly ResultRow[]> => {
//       const resultRows: ResultRow[] = [];
//       for (const map of this.delegate.query(query) as Map<string, Term>[]) {
//         for (const entry of map.entries()) {
//           const resultRow: Record<string, Term> = {};
//           resultRow[entry[0]] = entry[1];
//           resultRows.push(resultRow);
//         }
//       }
//       return resultRows;
//     },
//   };

//   readonly update: SparqlClient.Update = {
//     update: async (update: string) => this.delegate.update(update, {}),
//   };
// }
