/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import {
  NamedNode,
  DatasetCore,
  Term,
  Quad,
  BlankNode,
  Literal,
} from "@rdfjs/types";
import { Identifier } from "./Identifier";

export class Resource {
  private readonly dataset: DatasetCore;
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

  optionalValue<T>(
    property: NamedNode,
    mapper: Resource.ValueMapper<T>,
  ): NonNullable<T> | null {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      const mappedObject: T | null = mapper(
        quad.object as BlankNode | NamedNode | Literal,
        quad,
        this.dataset,
      );
      if (mappedObject !== null) {
        return mappedObject as NonNullable<T>;
      }
    }
    return null;
  }

  requiredValue<T>(
    property: NamedNode,
    mapper: Resource.ValueMapper<T>,
  ): NonNullable<T> {
    const value = this.optionalValue(property, mapper);
    if (value !== null) {
      return value;
    }
    throw new Error(`no appropriate ${property.value} found`);
  }

  *values<T>(
    property: NamedNode,
    mapper: Resource.ValueMapper<T>,
  ): Iterable<NonNullable<T>> {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      const mappedObject: T | null = mapper(
        quad.object as BlankNode | NamedNode | Literal,
        quad,
        this.dataset,
      );
      if (mappedObject !== null) {
        yield mappedObject as NonNullable<T>;
      }
    }
  }

  valuesCount(property: NamedNode, filter?: (value: Term) => boolean) {
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
}

export namespace Resource {
  export type ValueMapper<T> = (
    object: BlankNode | Literal | NamedNode,
    quad: Quad,
    dataset: DatasetCore,
  ) => NonNullable<T> | null;

  export namespace ValueMappers {
    export function identifier(
      object: BlankNode | Literal | NamedNode,
    ): Identifier | null {
      switch (object.termType) {
        case "BlankNode":
        case "NamedNode":
          return object;
        default:
          return null;
      }
    }

    export function iri(
      object: BlankNode | Literal | NamedNode,
    ): NamedNode | null {
      return object.termType === "NamedNode" ? object : null;
    }
  }
}
