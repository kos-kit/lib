/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BlankNode,
  DataFactory,
  DatasetCore,
  DefaultGraph,
  Literal,
  NamedNode,
} from "@rdfjs/types";
import { Just, Maybe, Nothing } from "purify-ts";
import { fromRdf } from "rdf-literal";

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
  ): Maybe<NonNullable<T>> {
    for (const value of this.values(property, mapper)) {
      return Just(value);
    }
    return Nothing;
  }

  requiredValue<T>(
    property: NamedNode,
    mapper: Resource.ValueMapper<T>,
  ): NonNullable<T> {
    for (const value of this.values(property, mapper)) {
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
      const mappedObject = mapper(
        quad.object as BlankNode | NamedNode | Literal,
        this.dataset,
      );
      if (mappedObject.isJust()) yield mappedObject.extract();
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
        mapper(
          quad.object as BlankNode | Literal | NamedNode,
          this.dataset,
        ).isJust()
      ) {
        count++;
      }
    }
    return count;
  }
}

export namespace Resource {
  export class Builder {
    private readonly dataFactory: DataFactory;

    readonly dataset: DatasetCore;
    readonly graph: DefaultGraph | NamedNode | BlankNode | undefined;
    readonly identifier: Identifier;

    constructor({
      dataFactory,
      dataset,
      identifier,
      graph,
    }: {
      dataFactory: DataFactory;
      dataset: DatasetCore;
      identifier: Resource.Identifier;
      graph?: DefaultGraph | NamedNode | BlankNode;
    }) {
      this.dataFactory = dataFactory;
      this.dataset = dataset;
      this.identifier = identifier;
      this.graph = graph;
    }

    add(predicate: NamedNode, object: BlankNode | Literal | NamedNode): this {
      this.dataset.add(
        this.dataFactory.quad(this.identifier, predicate, object, this.graph),
      );
      return this;
    }

    delete(
      predicate: NamedNode,
      object?: BlankNode | Literal | NamedNode,
    ): this {
      for (const quad of [
        ...this.dataset.match(this.identifier, predicate, object),
      ]) {
        this.dataset.delete(quad);
      }
      return this;
    }

    build(): Resource {
      return new Resource({
        dataset: this.dataset,
        identifier: this.identifier,
      });
    }

    set(predicate: NamedNode, object: BlankNode | Literal | NamedNode): this {
      for (const quad of [...this.dataset.match(this.identifier, predicate)]) {
        this.dataset.delete(quad);
      }
      return this.add(predicate, object);
    }
  }

  export type Identifier = BlankNode | NamedNode;

  export namespace Identifier {
    export function fromString({
      dataFactory,
      identifier,
    }: {
      dataFactory: DataFactory;
      identifier: string;
    }) {
      if (identifier.startsWith("_:")) {
        return dataFactory.blankNode(identifier.substring("_:".length));
      } else if (
        identifier.startsWith("<") &&
        identifier.endsWith(">") &&
        identifier.length > 2
      ) {
        return dataFactory.namedNode(
          identifier.substring(1, identifier.length - 1),
        );
      } else {
        throw new RangeError(identifier);
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
  ) => Maybe<NonNullable<T>>;

  export namespace ValueMappers {
    export function boolean(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<boolean> {
      return primitive(object).chain((primitive) =>
        typeof primitive === "boolean" ? Just(primitive) : Nothing,
      );
    }

    export function date(object: BlankNode | Literal | NamedNode): Maybe<Date> {
      return primitive(object).chain((primitive) =>
        primitive instanceof Date ? Just(primitive) : Nothing,
      );
    }

    export function identifier(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<Identifier> {
      switch (object.termType) {
        case "BlankNode":
        case "NamedNode":
          return Just(object);
        default:
          return Nothing;
      }
    }

    export function identity(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<BlankNode | Literal | NamedNode> {
      return Just(object);
    }

    export function iri(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<NamedNode> {
      return object.termType === "NamedNode" ? Just(object) : Nothing;
    }

    export function literal(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<Literal> {
      return object.termType === "Literal" ? Just(object) : Nothing;
    }

    export function number(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<number> {
      return primitive(object).chain((primitive) =>
        typeof primitive === "number" ? Just(primitive) : Nothing,
      );
    }

    export function primitive(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<boolean | Date | number | string> {
      if (object.termType !== "Literal") {
        return Nothing;
      }

      try {
        return Just(fromRdf(object, true));
      } catch {
        return Nothing;
      }
    }

    export function resource(
      object: BlankNode | Literal | NamedNode,
      dataset: DatasetCore,
    ): Maybe<Resource> {
      return identifier(object).map(
        (identifier) => new Resource({ dataset, identifier }),
      );
    }

    export function string(
      object: BlankNode | Literal | NamedNode,
    ): Maybe<string> {
      return primitive(object).chain((primitive) =>
        typeof primitive === "string" ? Just(primitive as string) : Nothing,
      );
    }
  }
}
