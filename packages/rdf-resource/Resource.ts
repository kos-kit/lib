/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BlankNode,
  DataFactory,
  DatasetCore,
  Literal,
  NamedNode,
  Quad,
  Quad_Graph,
  Quad_Object,
  Variable,
} from "@rdfjs/types";
import { Just, Maybe, Nothing } from "purify-ts";
import { fromRdf } from "rdf-literal";

export class Resource {
  protected readonly dataFactory: DataFactory;
  readonly dataset: DatasetCore;
  readonly identifier: Resource.Identifier;
  protected readonly mutateGraph: Exclude<Quad_Graph, Variable>;

  constructor({
    dataFactory,
    dataset,
    identifier,
    mutateGraph,
  }: Resource.Parameters) {
    this.dataFactory = dataFactory;
    this.dataset = dataset;
    this.identifier = identifier;
    this.mutateGraph = mutateGraph ?? dataFactory.defaultGraph();
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

  set(
    predicate: NamedNode,
    object: Exclude<Quad_Object, Quad | Variable>,
  ): this {
    this.delete(predicate);
    return this.add(predicate, object);
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
      switch (quad.object.termType) {
        case "Quad":
        case "Variable":
          continue;
      }

      const mappedObject = mapper(
        quad.object,
        this.dataFactory,
        this.dataset,
        this.mutateGraph,
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
          quad.object as Exclude<Quad_Object, Quad | Variable>,
          this.dataFactory,
          this.dataset,
          this.mutateGraph,
        ).isJust()
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
    object: Exclude<Quad_Object, Quad | Variable>,
    dataFactory: DataFactory,
    dataset: DatasetCore,
    mutateGraph: Exclude<Quad_Graph, Variable>,
  ) => Maybe<NonNullable<T>>;

  export namespace ValueMappers {
    export function boolean(
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<boolean> {
      return primitive(object).chain((primitive) =>
        typeof primitive === "boolean" ? Just(primitive) : Nothing,
      );
    }

    export function date(
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<Date> {
      return primitive(object).chain((primitive) =>
        primitive instanceof Date ? Just(primitive) : Nothing,
      );
    }

    export function identifier(
      object: Exclude<Quad_Object, Quad | Variable>,
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
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<Exclude<Quad_Object, Quad | Variable>> {
      return Just(object);
    }

    export function iri(
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<NamedNode> {
      return object.termType === "NamedNode" ? Just(object) : Nothing;
    }

    export function literal(
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<Literal> {
      return object.termType === "Literal" ? Just(object) : Nothing;
    }

    export function number(
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<number> {
      return primitive(object).chain((primitive) =>
        typeof primitive === "number" ? Just(primitive) : Nothing,
      );
    }

    export function primitive(
      object: Exclude<Quad_Object, Quad | Variable>,
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
      object: Exclude<Quad_Object, Quad | Variable>,
      dataFactory: DataFactory,
      dataset: DatasetCore,
      mutateGraph: Exclude<Quad_Graph, Variable>,
    ): Maybe<Resource> {
      return identifier(object).map(
        (identifier) =>
          new Resource({ dataFactory, dataset, mutateGraph, identifier }),
      );
    }

    export function string(
      object: Exclude<Quad_Object, Quad | Variable>,
    ): Maybe<string> {
      return primitive(object).chain((primitive) =>
        typeof primitive === "string" ? Just(primitive as string) : Nothing,
      );
    }
  }

  export interface Parameters {
    dataFactory: DataFactory;
    dataset: DatasetCore;
    mutateGraph?: Exclude<Quad_Graph, Variable>;
    identifier: Resource.Identifier;
  }
}
