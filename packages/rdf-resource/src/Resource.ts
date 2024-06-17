/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import { NamedNode, DatasetCore, BlankNode, Literal } from "@rdfjs/types";
import { DataFactory } from "n3";
// import DataFactory from "@rdfjs/data-model";

export class Resource {
  readonly dataset: DatasetCore;
  readonly identifier: Resource.Identifier;

  constructor({
    dataset,
    identifier,
  }: {
    dataset: DatasetCore;
    identifier: Resource.Identifier;
  }) {
    this.dataset = dataset;
    this.identifier = identifier;
  }

  optionalValue<T>(
    property: NamedNode,
    mapper: Resource.ValueMapper<T>,
  ): NonNullable<T> | null {
    for (const value of this.values(property, mapper)) {
      return value;
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
        this.dataset,
      );
      if (mappedObject !== null) {
        yield mappedObject as NonNullable<T>;
      }
    }
  }

  valuesCount<T>(property: NamedNode, mapper: Resource.ValueMapper<T>) {
    let count = 0;
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      if (
        mapper(quad.object as BlankNode | Literal | NamedNode, this.dataset) !==
        null
      ) {
        count++;
      }
    }
    return count;
  }
}

export namespace Resource {
  export type Identifier = BlankNode | NamedNode;

  export namespace Identifier {
    export function fromString(str: string) {
      if (str.startsWith("_:")) {
        return DataFactory.blankNode(str.substring("_:".length));
      } else if (str.startsWith("<") && str.endsWith(">") && str.length > 2) {
        return DataFactory.namedNode(str.substring(1, str.length - 1));
      } else {
        throw new RangeError(str);
      }
    }

    export function toString(identifier: Identifier) {
      switch (identifier.termType) {
        case "BlankNode":
          return `_:${identifier.value}`;
        case "NamedNode":
          return `<${identifier.value}>`;
      }
    }
  }

  export type ValueMapper<T> = (
    object: BlankNode | Literal | NamedNode,
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

    export function identity(
      object: BlankNode | Literal | NamedNode,
    ): BlankNode | Literal | NamedNode {
      return object;
    }

    export function literal(
      object: BlankNode | Literal | NamedNode,
    ): Literal | null {
      return object.termType === "Literal" ? object : null;
    }

    export function resource(
      object: BlankNode | Literal | NamedNode,
      dataset: DatasetCore,
    ): Resource | null {
      const identifier = Resource.ValueMappers.identifier(object);
      if (identifier !== null) {
        return new Resource({ dataset, identifier });
      }
      return null;
    }
  }
}
