import { Model as IModel, LanguageTagSet } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";
import { matchLiteral } from "./matchLiteral.js";
import { Just, Maybe, Nothing } from "purify-ts";

const rightsPredicates = [dcterms.rights, dc11.rights];
/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class Model implements IModel {
  protected readonly includeLanguageTags: LanguageTagSet;
  protected readonly resource: Resource;

  constructor({ includeLanguageTags, resource }: Model.Parameters) {
    this.resource = resource;
    this.includeLanguageTags = includeLanguageTags;
  }

  get identifier(): Resource.Identifier {
    return this.resource.identifier;
  }

  get license(): Maybe<Literal | NamedNode> {
    const literals: Literal[] = [];

    for (const object of this.resource.values(dcterms.license, (term) =>
      term.termType === "Literal" || term.termType == "NamedNode"
        ? Just(term)
        : Nothing,
    )) {
      switch (object.termType) {
        case "NamedNode":
          return Just(object);
        case "Literal":
          literals.push(object);
          break;
        default:
          break;
      }
    }

    if (literals.length === 0) {
      return Nothing;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return Just(literal);
    }

    return Nothing;
  }

  get modified(): Maybe<Literal> {
    return this.resource.value(dcterms.modified, Resource.ValueMappers.literal);
  }

  get rights(): Maybe<Literal> {
    for (const predicate of rightsPredicates) {
      const value = this.literalObject(predicate);
      if (value.isJust()) {
        return value;
      }
    }
    return Nothing;
  }

  get rightsHolder(): Maybe<Literal> {
    return this.literalObject(dcterms.rightsHolder);
  }

  protected get dataset(): DatasetCore {
    return this.resource.dataset;
  }

  private literalObject(predicate: NamedNode): Maybe<Literal> {
    const literals: readonly Literal[] = [
      ...this.resource.values(predicate, Resource.ValueMappers.literal),
    ];

    if (literals.length === 0) {
      return Nothing;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return Just(literal);
    }

    return Nothing;
  }
}

export namespace Model {
  export interface Parameters {
    includeLanguageTags: LanguageTagSet;
    resource: Resource;
  }
}
