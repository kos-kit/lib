import { DataFactory, DatasetCore, NamedNode } from "@rdfjs/types";
import { Resource } from "./Resource";
import { MutableResource } from "./MutableResource";
import { getRdfInstances } from "@kos-kit/rdf-utils";

/**
 * A ResourceSet wraps an RDF/JS dataset with convenient resource factory methods.
 */
export class ResourceSet {
  protected readonly dataFactory: DataFactory;
  readonly dataset: DatasetCore;

  constructor({
    dataFactory,
    dataset,
  }: {
    dataFactory: DataFactory;
    dataset: DatasetCore;
  }) {
    this.dataFactory = dataFactory;
    this.dataset = dataset;
  }

  *instancesOf(
    class_: NamedNode,
    options?: {
      includeSubclasses?: boolean;
      instanceOfPredicate?: NamedNode;
      subClassOfPredicate?: NamedNode;
    },
  ): Generator<Resource> {
    for (const identifier of getRdfInstances({
      class_,
      dataset: this.dataset,
      ...options,
    })) {
      yield this.resource(identifier);
    }
  }

  mutableResource({
    identifier,
    mutateGraph,
  }: {
    identifier: Resource.Identifier;
    mutateGraph: MutableResource.MutateGraph;
  }): MutableResource {
    return new MutableResource({
      dataFactory: this.dataFactory,
      dataset: this.dataset,
      identifier,
      mutateGraph,
    });
  }

  resource(identifier: Resource.Identifier): Resource {
    return new Resource({
      dataset: this.dataset,
      identifier,
    });
  }
}
