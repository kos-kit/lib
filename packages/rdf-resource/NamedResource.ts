import {
  DataFactory,
  DatasetCore,
  NamedNode,
  Quad,
  Quad_Graph,
  Quad_Object,
  Variable,
} from "@rdfjs/types";
import { Resource } from "./Resource.js";
import { Maybe } from "purify-ts";

export class NamedResource extends Resource {
  constructor({
    iri,
    ...resourceParameters
  }: Omit<Resource.Parameters, "identifier"> & { iri: NamedNode }) {
    super({ identifier: iri, ...resourceParameters });
  }

  get iri(): NamedNode {
    return this.identifier as NamedNode;
  }

  static valueMapper(
    object: Exclude<Quad_Object, Quad | Variable>,
    dataFactory: DataFactory,
    dataset: DatasetCore,
    mutateGraph: Exclude<Quad_Graph, Variable>,
  ): Maybe<NamedResource> {
    return Resource.ValueMappers.iri(object).map(
      (iri) =>
        new NamedResource({
          dataFactory,
          dataset,
          iri,
          mutateGraph,
        }),
    );
  }
}
