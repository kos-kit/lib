import { DatasetCore, NamedNode } from "@rdfjs/types";
import { Resource } from "./Resource.js";
import { getRdfInstances } from "@kos-kit/rdf-utils";

/**
 * A ResourceSet wraps an RDF/JS dataset with convenient resource factory methods.
 */
export class ResourceSet {
  readonly dataset: DatasetCore;

  constructor({ dataset }: { dataset: DatasetCore }) {
    this.dataset = dataset;
  }

  *instancesOf(
    class_: NamedNode,
    options?: {
      excludeSubclasses?: boolean;
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

  resource(identifier: Resource.Identifier): Resource {
    return new Resource({
      dataset: this.dataset,
      identifier,
    });
  }
}
