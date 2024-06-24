import { NamedNode, Literal, BlankNode } from "@rdfjs/types";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";
import { Model as IModel, LanguageTagSet } from "@kos-kit/models";
import { Kos } from "./Kos.js";
import { Resource } from "@kos-kit/rdf-resource";
import { matchLiteral } from "./matchLiteral.js";
import * as O from "fp-ts/Option";

const rightsPredicates = [dcterms.rights, dc11.rights];

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class Model implements IModel {
  protected readonly kos: Kos;
  protected readonly resource: Resource;

  constructor({
    identifier,
    kos,
  }: {
    identifier: Resource.Identifier;
    kos: Kos;
  }) {
    this.kos = kos;
    this.resource = new Resource({ dataset: kos.dataset, identifier });
  }

  protected get includeLanguageTags(): LanguageTagSet {
    return this.kos.includeLanguageTags;
  }

  get identifier(): BlankNode | NamedNode {
    return this.resource.identifier;
  }

  private literalObject(predicate: NamedNode): O.Option<Literal> {
    const literals: readonly Literal[] = [
      ...this.resource.values(predicate, Resource.ValueMappers.literal),
    ];

    if (literals.length === 0) {
      return O.none;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return O.some(literal);
    }

    return O.none;
  }

  get license(): O.Option<Literal | NamedNode> {
    const literals: Literal[] = [];

    for (const object of this.resource.values(dcterms.license, (term) =>
      term.termType === "Literal" || term.termType == "NamedNode"
        ? O.some(term)
        : O.none,
    )) {
      switch (object.termType) {
        case "NamedNode":
          return O.some(object);
        case "Literal":
          literals.push(object);
          break;
        default:
          break;
      }
    }

    if (literals.length === 0) {
      return O.none;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return O.some(literal);
    }

    return O.none;
  }

  get modified(): O.Option<Literal> {
    return this.resource.optionalValue(
      dcterms.modified,
      Resource.ValueMappers.literal,
    );
  }

  get rights(): O.Option<Literal> {
    for (const predicate of rightsPredicates) {
      const value = this.literalObject(predicate);
      if (O.isSome(value)) {
        return value;
      }
    }
    return O.none;
  }

  get rightsHolder(): O.Option<Literal> {
    return this.literalObject(dcterms.rightsHolder);
  }
}
