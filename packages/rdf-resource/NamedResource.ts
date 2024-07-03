import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Resource } from "./Resource.js";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

export class NamedResource extends Resource {
  constructor({ dataset, iri }: { dataset: DatasetCore; iri: NamedNode }) {
    super({ dataset, identifier: iri });
  }

  get iri(): NamedNode {
    return this.identifier as NamedNode;
  }

  static valueMapper(
    object: BlankNode | Literal | NamedNode,
    dataset: DatasetCore,
  ): O.Option<NamedResource> {
    return pipe(
      Resource.ValueMappers.iri(object),
      O.map((iri: NamedNode) => new NamedResource({ dataset, iri })),
    );
  }
}
