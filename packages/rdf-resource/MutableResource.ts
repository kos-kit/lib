/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DataFactory,
  NamedNode,
  Quad,
  Quad_Graph,
  Quad_Object,
  Variable,
} from "@rdfjs/types";
import { Resource } from "./Resource.js";

export class MutableResource<
  IdentifierT extends Resource.Identifier = Resource.Identifier,
> extends Resource<IdentifierT> {
  readonly dataFactory: DataFactory;
  readonly mutateGraph: Exclude<Quad_Graph, Variable>;

  constructor({
    dataFactory,
    mutateGraph,
    ...resourceParameters
  }: MutableResource.Parameters<IdentifierT>) {
    super(resourceParameters);
    this.dataFactory = dataFactory;
    this.mutateGraph = mutateGraph;
  }

  add(
    predicate: NamedNode,
    object: Exclude<Quad_Object, Quad | Variable>,
  ): this {
    this.dataset.add(
      this.dataFactory.quad(
        this.identifier,
        predicate,
        object,
        this.mutateGraph,
      ),
    );
    return this;
  }

  delete(
    predicate: NamedNode,
    object?: Exclude<Quad_Object, Quad | Variable>,
  ): this {
    for (const quad of [
      ...this.dataset.match(
        this.identifier,
        predicate,
        object,
        this.mutateGraph,
      ),
    ]) {
      this.dataset.delete(quad);
    }
    return this;
  }

  set(
    predicate: NamedNode,
    object: Exclude<Quad_Object, Quad | Variable>,
  ): this {
    this.delete(predicate);
    return this.add(predicate, object);
  }
}

export namespace MutableResource {
  export interface Parameters<IdentifierT extends Resource.Identifier>
    extends Resource.Parameters<IdentifierT> {
    dataFactory: DataFactory;
    mutateGraph: Exclude<Quad_Graph, Variable>;
  }
}
