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
  readonly boolean: Maybe<boolean> = Nothing;
  readonly date: Maybe<Date> = Nothing;
  readonly identifier: Maybe<Resource.Identifier> = Nothing;
  readonly iri: Maybe<NamedNode<string>> = Nothing;
  readonly isBoolean: boolean = false;
  readonly isDate: boolean = false;
  readonly isIdentifier: boolean = false;
  readonly isIri: boolean = false;
  readonly isLiteral: boolean = false;
  readonly isNumber: boolean = false;
  readonly isPrimitive: boolean = false;
  readonly isString: boolean = false;
  readonly isTerm: boolean = false;
  readonly literal: Maybe<Literal> = Nothing;
  readonly namedResource: Maybe<Resource<NamedNode<string>>> = Nothing;
  readonly primitive: Maybe<string | number | boolean | Date> = Nothing;
  readonly number: Maybe<number> = Nothing;
  readonly resource: Maybe<Resource<Resource.Identifier>> = Nothing;
  readonly string: Maybe<string> = Nothing;
  readonly term: Maybe<NamedNode<string> | Literal | BlankNode> = Nothing;
}

const nothingResourceValue = new NothingResourceValue();

class SomeResourceValue implements Resource.Value {
  constructor(
    private readonly object: Exclude<Quad_Object, Quad | Variable>,
    private readonly subjectResource: Resource,
  ) {}
  get boolean(): Maybe<boolean> {
    return this.primitive.chain((primitive) =>
      typeof primitive === "boolean" ? Just(primitive) : Nothing,
    );
  }

  get date(): Maybe<Date> {
    return this.primitive.chain((primitive) =>
      primitive instanceof Date ? Just(primitive) : Nothing,
    );
  }

  get identifier(): Maybe<Resource.Identifier> {
    switch (this.object.termType) {
      case "BlankNode":
      case "NamedNode":
        return Just(this.object);
      default:
        return Nothing;
    }
  }

  get iri(): Maybe<NamedNode> {
    return this.object.termType === "NamedNode" ? Just(this.object) : Nothing;
  }

  get isBoolean(): boolean {
    return this.boolean.isJust();
  }

  get isDate(): boolean {
    return this.date.isJust();
  }

  get isIdentifier(): boolean {
    switch (this.object.termType) {
      case "BlankNode":
      case "NamedNode":
        return true;
      default:
        return false;
    }
  }

  get isIri(): boolean {
    return this.object.termType === "NamedNode";
  }

  get isLiteral(): boolean {
    return this.object.termType === "Literal";
  }

  get isNumber(): boolean {
    return this.number.isJust();
  }

  get isPrimitive(): boolean {
    return this.primitive.isJust();
  }

  get isString(): boolean {
    return this.string.isJust();
  }

  readonly isTerm = true;

  get literal(): Maybe<Literal> {
    return this.object.termType === "Literal" ? Just(this.object) : Nothing;
  }

  get namedResource(): Maybe<Resource<NamedNode>> {
    return this.iri.map(
      (identifier) =>
        new Resource<NamedNode>({
          dataset: this.subjectResource.dataset,
          identifier,
        }),
    );
  }

  get number(): Maybe<number> {
    return this.primitive.chain((primitive) =>
      typeof primitive === "number" ? Just(primitive) : Nothing,
    );
  }

  get primitive(): Maybe<boolean | Date | number | string> {
    if (this.object.termType !== "Literal") {
      return Nothing;
    }

    try {
      return Just(fromRdf(this.object, true));
    } catch {
      return Nothing;
    }
  }

  get resource(): Maybe<Resource> {
    return this.identifier.map(
      (identifier) =>
        new Resource({ dataset: this.subjectResource.dataset, identifier }),
    );
  }

  get string(): Maybe<string> {
    return this.primitive.chain((primitive) =>
      typeof primitive === "string" ? Just(primitive as string) : Nothing,
    );
  }

  get term(): Maybe<Exclude<Quad_Object, Quad | Variable>> {
    return Just(this.object);
  }
}

export class Resource<
  IdentifierT extends Resource.Identifier = Resource.Identifier,
> {
  readonly dataset: DatasetCore;
  readonly identifier: IdentifierT;

  constructor({ dataset, identifier }: Resource.Parameters<IdentifierT>) {
    this.dataset = dataset;
    this.identifier = identifier;
  }

  value(property: NamedNode): Resource.Value {
    for (const value of this.values(property)) {
      return value;
    }
    return nothingResourceValue;
  }

  *values(property: NamedNode): Iterable<Resource.Value> {
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

      yield new SomeResourceValue(quad.object, this);
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
    readonly boolean: Maybe<boolean>;
    readonly date: Maybe<Date>;
    readonly identifier: Maybe<Identifier>;
    readonly iri: Maybe<NamedNode>;
    readonly isBoolean: boolean;
    readonly isDate: boolean;
    readonly isIdentifier: boolean;
    readonly isIri: boolean;
    readonly isLiteral: boolean;
    readonly isNumber: boolean;
    readonly isPrimitive: boolean;
    readonly isString: boolean;
    readonly isTerm: boolean;
    readonly literal: Maybe<Literal>;
    readonly namedResource: Maybe<Resource<NamedNode>>;
    readonly number: Maybe<number>;
    readonly primitive: Maybe<boolean | Date | number | string>;
    readonly resource: Maybe<Resource>;
    readonly string: Maybe<string>;
    readonly term: Maybe<Exclude<Quad_Object, Quad | Variable>>;
  }
}
