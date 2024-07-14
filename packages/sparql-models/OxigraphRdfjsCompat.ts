// import * as oxigraph from "oxigraph";
// import * as rdfjs from "@rdfjs/types";

// export type Quad = oxigraph.Quad;

// export class DatasetCore implements rdfjs.DatasetCore<Quad, Quad> {
//   constructor(private readonly delegate: oxigraph.Store) {}

//   add(quad: Quad): this {
//     this.delegate.add(quad);
//     return this;
//   }

//   delete(quad: Quad): this {
//     this.delegate.delete(quad);
//     return this;
//   }

//   has(quad: Quad): boolean {
//     return this.delegate.has(quad);
//   }

//   match(
//     subject?: rdfjs.Term | null,
//     predicate?: rdfjs.Term | null,
//     object?: rdfjs.Term | null,
//     graph?: rdfjs.Term | null,
//   ): DatasetCore {
//     return new DatasetCore(
//       new oxigraph.Store(
//         this.delegate.match(subject, predicate, object, graph),
//       ),
//     );
//   }

//   *[Symbol.iterator](): Iterator<Quad> {
//     for (const quad of this.delegate.match(null, null, null, null)) {
//       yield quad as Quad;
//     }
//   }

//   get size() {
//     return this.delegate.size;
//   }
// }
