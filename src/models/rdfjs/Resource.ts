import { NamedNode, DatasetCore, Term } from "@rdfjs/types";
import { Identifier } from "../Identifier";

export class Resource {
  protected readonly dataset: DatasetCore;
  readonly identifier: Identifier;

  constructor({
    dataset,
    identifier,
  }: {
    dataset: DatasetCore;
    identifier: Identifier;
  }) {
    this.dataset = dataset;
    this.identifier = identifier;
  }

  protected countObjects(
    property: NamedNode,
    filter?: (value: Term) => boolean,
  ) {
    if (!filter) {
      filter = () => true;
    }

    let count = 0;
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      if (filter(quad.object)) {
        count++;
      }
    }
    return count;
  }

  protected findAndMapObject<T>(
    property: NamedNode,
    callback: (value: Term) => NonNullable<T> | null,
  ): NonNullable<T> | null {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      const mappedObject: T | null = callback(quad.object);
      if (mappedObject !== null) {
        return mappedObject as NonNullable<T>;
      }
    }
    return null;
  }

  protected *filterAndMapObjects<T>(
    property: NamedNode,
    callback: (value: Term) => NonNullable<T> | null,
  ): Iterable<NonNullable<T>> {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      const mappedObject: T | null = callback(quad.object);
      if (mappedObject !== null) {
        yield mappedObject as NonNullable<T>;
      }
    }
  }
}
