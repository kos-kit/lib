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
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

const xsdNamespace = "http://www.w3.org/2001/XMLSchema#";
const xsdBooleanIri = xsdNamespace + "boolean";

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
  ): O.Option<NonNullable<T>> {
    for (const value of this.values(property, mapper)) {
      return O.some(value);
    }
    return O.none;
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
      if (O.isSome(mappedObject)) yield mappedObject.value;
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
        O.isSome(
          mapper(quad.object as BlankNode | Literal | NamedNode, this.dataset),
        )
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
    readonly identifier: Identifier;
    readonly graph: DefaultGraph | NamedNode | BlankNode | undefined;

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
  ) => O.Option<NonNullable<T>>;

  export namespace ValueMappers {
    export function boolean(
      object: BlankNode | Literal | NamedNode,
    ): O.Option<boolean> {
      if (object.termType !== "Literal") {
        return O.none;
      }
      if (object.datatype.value !== xsdBooleanIri) {
        return O.none;
      }
      switch (object.value.toLowerCase()) {
        case "1":
        case "true":
          return O.some(true);
        case "0":
        case "false":
          return O.some(false);
        default:
          return O.none;
      }
    }

    export function identifier(
      object: BlankNode | Literal | NamedNode,
    ): O.Option<Identifier> {
      switch (object.termType) {
        case "BlankNode":
        case "NamedNode":
          return O.some(object);
        default:
          return O.none;
      }
    }

    export function iri(
      object: BlankNode | Literal | NamedNode,
    ): O.Option<NamedNode> {
      return object.termType === "NamedNode" ? O.some(object) : O.none;
    }

    export function identity(
      object: BlankNode | Literal | NamedNode,
    ): O.Option<BlankNode | Literal | NamedNode> {
      return O.some(object);
    }

    export function literal(
      object: BlankNode | Literal | NamedNode,
    ): O.Option<Literal> {
      return object.termType === "Literal" ? O.some(object) : O.none;
    }

    export function resource(
      object: BlankNode | Literal | NamedNode,
      dataset: DatasetCore,
    ): O.Option<Resource> {
      return pipe(
        Resource.ValueMappers.identifier(object),
        O.map(
          (identifier: Resource.Identifier) =>
            new Resource({ dataset, identifier }),
        ),
      );
    }

    export function string(
      object: BlankNode | Literal | NamedNode,
    ): O.Option<string> {
      return pipe(
        Resource.ValueMappers.literal(object),
        O.map((literal: Literal) => literal.value),
      );
    }
  }
}
