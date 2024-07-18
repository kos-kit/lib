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

class NothingResourceValue implements Resource.Value {
  isBoolean(): boolean {
    return false;
  }
  isDate(): boolean {
    return false;
  }
  isIdentifier(): boolean {
    return false;
  }
  isIri(): boolean {
    return false;
  }
  isLiteral(): boolean {
    return false;
  }
  isNumber(): boolean {
    return false;
  }
  isPrimitive(): boolean {
    return false;
  }
  isString(): boolean {
    return false;
  }
  isTerm(): boolean {
    return false;
  }
  toBoolean(): Maybe<boolean> {
    return Nothing;
  }
  toDate(): Maybe<Date> {
    return Nothing;
  }
  toIdentifier(): Maybe<Resource.Identifier> {
    return Nothing;
  }
  toIri(): Maybe<NamedNode> {
    return Nothing;
  }
  toLiteral(): Maybe<Literal> {
    return Nothing;
  }
  toNamedResource(): Maybe<Resource<NamedNode>> {
    return Nothing;
  }
  toNumber(): Maybe<number> {
    return Nothing;
  }
  toPrimitive(): Maybe<boolean | Date | number | string> {
    return Nothing;
  }
  toResource(): Maybe<Resource> {
    return Nothing;
  }
  toString(): Maybe<string> {
    return Nothing;
  }
  toTerm(): Maybe<Exclude<Quad_Object, Quad | Variable>> {
    return Nothing;
  }
}

const nothingResourceValue = new NothingResourceValue();

class SomeResourceValue implements Resource.Value {
  constructor(
    private readonly object: Exclude<Quad_Object, Quad | Variable>,
    private readonly subjectResource: Resource,
  ) {}
  isBoolean(): boolean {
    return this.toBoolean().isJust();
  }

  isDate(): boolean {
    return this.toDate().isJust();
  }

  isIdentifier(): boolean {
    switch (this.object.termType) {
      case "BlankNode":
      case "NamedNode":
        return true;
      default:
        return false;
    }
  }

  isIri(): boolean {
    return this.object.termType === "NamedNode";
  }

  isLiteral(): boolean {
    return this.object.termType === "Literal";
  }

  isNumber(): boolean {
    return this.toNumber().isJust();
  }

  isPrimitive(): boolean {
    return this.toPrimitive().isJust();
  }

  isString(): boolean {
    return this.toString().isJust();
  }

  isTerm(): boolean {
    return true;
  }

  toBoolean(): Maybe<boolean> {
    return this.toPrimitive().chain((primitive) =>
      typeof primitive === "boolean" ? Just(primitive) : Nothing,
    );
  }

  toDate(): Maybe<Date> {
    return this.toPrimitive().chain((primitive) =>
      primitive instanceof Date ? Just(primitive) : Nothing,
    );
  }

  toIdentifier(): Maybe<Resource.Identifier> {
    switch (this.object.termType) {
      case "BlankNode":
      case "NamedNode":
        return Just(this.object);
      default:
        return Nothing;
    }
  }

  toIri(): Maybe<NamedNode> {
    return this.object.termType === "NamedNode" ? Just(this.object) : Nothing;
  }

  toLiteral(): Maybe<Literal> {
    return this.object.termType === "Literal" ? Just(this.object) : Nothing;
  }

  toNamedResource(): Maybe<Resource<NamedNode>> {
    return this.toIri().map(
      (identifier) =>
        new Resource<NamedNode>({
          dataset: this.subjectResource.dataset,
          identifier,
        }),
    );
  }

  toNumber(): Maybe<number> {
    return this.toPrimitive().chain((primitive) =>
      typeof primitive === "number" ? Just(primitive) : Nothing,
    );
  }

  toPrimitive(): Maybe<boolean | Date | number | string> {
    if (this.object.termType !== "Literal") {
      return Nothing;
    }

    try {
      return Just(fromRdf(this.object, true));
    } catch {
      return Nothing;
    }
  }

  toResource(): Maybe<Resource> {
    return this.toIdentifier().map(
      (identifier) =>
        new Resource({ dataset: this.subjectResource.dataset, identifier }),
    );
  }

  toString(): Maybe<string> {
    return this.toPrimitive().chain((primitive) =>
      typeof primitive === "string" ? Just(primitive as string) : Nothing,
    );
  }

  toTerm(): Maybe<Exclude<Quad_Object, Quad | Variable>> {
    return Just(this.object);
  }
}

function defaultValueOfFilter(_subject: Resource): boolean {
  return true;
}

function defaultValueFilter(_value: Resource.Value): boolean {
  return true;
}

/**
 * A Resource abstraction over subjects or objects in an RDF/JS dataset.
 */
export class Resource<
  IdentifierT extends Resource.Identifier = Resource.Identifier,
> {
  readonly dataset: DatasetCore;
  readonly identifier: IdentifierT;

  constructor({ dataset, identifier }: Resource.Parameters<IdentifierT>) {
    this.dataset = dataset;
    this.identifier = identifier;
  }

  /**
   * Get the first matching value of dataset statements (this.identifier, property, value).
   */
  value(
    property: NamedNode,
    filter?: (value: Resource.Value) => boolean,
  ): Resource.Value {
    if (!filter) {
      filter = defaultValueFilter;
    }
    for (const value of this.values(property)) {
      if (filter(value)) {
        return value;
      }
    }
    return nothingResourceValue;
  }

  /**
   * Get the first matching subject of dataset statements (subject, property, this.identifier).
   */
  valueOf(
    property: NamedNode,
    filter?: (subject: Resource) => boolean,
  ): Maybe<Resource> {
    if (!filter) {
      filter = defaultValueOfFilter;
    }
    for (const resource of this.valuesOf(property)) {
      return Just(resource);
    }
    return Nothing;
  }

  /**
   * Get all values of dataset statements (this.identifier, property, value).
   */
  *values(property: NamedNode): Generator<Resource.Value> {
    for (const quad of this.dataset.match(
      this.identifier,
      property,
      null,
      null,
    )) {
      switch (quad.object.termType) {
        case "BlankNode":
        case "Literal":
        case "NamedNode":
          yield new SomeResourceValue(quad.object, this);
          break;
      }
    }
  }

  /**
   * Get the first subject of dataset statements (subject, property, this.identifier).
   */
  *valuesOf(property: NamedNode): Generator<Resource> {
    for (const quad of this.dataset.match(
      null,
      property,
      this.identifier,
      null,
    )) {
      switch (quad.subject.termType) {
        case "BlankNode":
        case "NamedNode":
          yield new Resource({
            dataset: this.dataset,
            identifier: quad.subject,
          });
          break;
      }
    }
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

  export interface Value {
    isBoolean(): boolean;
    isDate(): boolean;
    isIdentifier(): boolean;
    isIri(): boolean;
    isLiteral(): boolean;
    isNumber(): boolean;
    isPrimitive(): boolean;
    isString(): boolean;
    isTerm(): boolean;
    toBoolean(): Maybe<boolean>;
    toDate(): Maybe<Date>;
    toIdentifier(): Maybe<Identifier>;
    toIri(): Maybe<NamedNode>;
    toLiteral(): Maybe<Literal>;
    toNamedResource(): Maybe<Resource<NamedNode>>;
    toNumber(): Maybe<number>;
    toPrimitive(): Maybe<boolean | Date | number | string>;
    toResource(): Maybe<Resource>;
    toString(): Maybe<string>;
    toTerm(): Maybe<Exclude<Quad_Object, Quad | Variable>>;
  }
}
