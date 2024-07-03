import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Resource } from "./Resource.js";
import { Maybe } from "purify-ts";

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
  ): Maybe<NamedResource> {
    return Resource.ValueMappers.iri(object).map(
      (iri) => new NamedResource({ dataset, iri }),
    );
  }
}
