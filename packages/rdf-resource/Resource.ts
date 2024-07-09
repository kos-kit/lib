import {
  BlankNode,
  DataFactory,
  DatasetCore,
  Literal,
  NamedNode,
  Quad,
  Quad_Object,
  Variable,
} from "@rdfjs/types";
import { Just, Maybe, Nothing } from "purify-ts";
import { fromRdf } from "rdf-literal";

export class Resource<
  IdentifierT extends Resource.Identifier = Resource.Identifier,
> {
  readonly dataset: DatasetCore;
  readonly identifier: IdentifierT;

  constructor({ dataset, identifier }: Resource.Parameters<IdentifierT>) {
    this.dataset = dataset;
    this.identifier = identifier;
  }

  value<T>(
    property: NamedNode,
    mapper: Resource.ValueMapper<T>,
  ): Maybe<NonNullable<T>> {
    for (const value of this.values(property, mapper)) {
      return Just(value);
    }
    return Nothing;
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

      const mappedObject = mapper(quad.object, this);
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
      switch (quad.object.termType) {
        case "Quad":
        case "Variable":
          continue;
      }

      if (mapper(quad.object, this).isJust()) {
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

  export interface Parameters<IdentifierT extends Identifier> {
    dataset: DatasetCore;
    identifier: IdentifierT;
  }

  export type ValueMapper<ValueT> = (
    object: Exclude<Quad_Object, Quad | Variable>,
    resource: Resource,
  ) => Maybe<NonNullable<ValueT>>;

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

    export function namedResource(
      object: Exclude<Quad_Object, Quad | Variable>,
      resource: Resource,
    ): Maybe<Resource<NamedNode>> {
      return iri(object).map(
        (identifier) =>
          new Resource<NamedNode>({ dataset: resource.dataset, identifier }),
      );
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
      resource: Resource,
    ): Maybe<Resource> {
      return identifier(object).map(
        (identifier) => new Resource({ dataset: resource.dataset, identifier }),
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
}
