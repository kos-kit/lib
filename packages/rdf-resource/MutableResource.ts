import { createRdfList } from "@kos-kit/rdf-utils";
/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BlankNode,
  DataFactory,
  NamedNode,
  Quad,
  Quad_Graph,
  Quad_Object,
  Variable,
} from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Resource } from "./Resource.js";

type Value = Exclude<Quad_Object, Quad | Variable>;

/**
 * Resource subclass with operations to mutate the underlying dataset.
 */
export class MutableResource<
  IdentifierT extends Resource.Identifier = Resource.Identifier,
> extends Resource<IdentifierT> {
  readonly dataFactory: DataFactory;
  readonly mutateGraph: MutableResource.MutateGraph;

  constructor({
    dataFactory,
    mutateGraph,
    ...resourceParameters
  }: MutableResource.Parameters<IdentifierT>) {
    super(resourceParameters);
    this.dataFactory = dataFactory;
    this.mutateGraph = mutateGraph;
  }

  add(predicate: NamedNode, value: Value): this {
    this.dataset.add(
      this.dataFactory.quad(
        this.identifier,
        predicate,
        value,
        this.mutateGraph,
      ),
    );
    return this;
  }

  addList(
    predicate: NamedNode,
    valuesList: Iterable<Value>,
    options?: MutableResource.AddListOptions,
  ): this {
    const listIdentifier = createRdfList({
      dataFactory: this.dataFactory,
      dataset: this.dataset,
      generateIdentifier: options?.generateIdentifier,
      items: valuesList,
    });
    if (options?.rdfType) {
      this.dataset.add(
        this.dataFactory.quad(
          listIdentifier,
          rdf.type,
          options.rdfType,
          this.mutateGraph,
        ),
      );
    }
    return this.add(predicate, listIdentifier);
  }

  delete(predicate: NamedNode, value?: Value): this {
    for (const quad of [
      ...this.dataset.match(
        this.identifier,
        predicate,
        value,
        this.mutateGraph,
      ),
    ]) {
      this.dataset.delete(quad);
    }
    return this;
  }

  set(predicate: NamedNode, value: Value): this {
    this.delete(predicate);
    return this.add(predicate, value);
  }
}

export namespace MutableResource {
  export type MutateGraph = Exclude<Quad_Graph, Variable>;

  export interface AddListOptions {
    generateIdentifier?: (
      item: Value,
      itemIndex: number,
    ) => BlankNode | NamedNode;
    rdfType?: NamedNode;
  }

  export interface Parameters<IdentifierT extends Resource.Identifier>
    extends Resource.Parameters<IdentifierT> {
    dataFactory: DataFactory;
    mutateGraph: Exclude<Quad_Graph, Variable>;
  }
}
