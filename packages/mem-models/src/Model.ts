import { NamedNode, Literal, BlankNode } from "@rdfjs/types";
import { dc11, dcterms } from "@tpluscode/rdf-ns-builders";
import { Model as IModel, LanguageTagSet } from "@kos-kit/models";
import { Kos } from "./Kos";
import { Resource } from "@kos-kit/rdf-resource";
import { matchLiteral } from "./matchLiteral";

const rightsPredicates = [dcterms.rights, dc11.rights];

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class Model implements IModel {
  protected readonly kos: Kos;
  protected readonly resource: Resource;

  constructor({ kos, resource }: { kos: Kos; resource: Resource }) {
    this.kos = kos;
    this.resource = resource;
  }

  protected get includeLanguageTags(): LanguageTagSet {
    return this.kos.includeLanguageTags;
  }

  get identifier(): BlankNode | NamedNode {
    return this.resource.identifier;
  }

  private literalObject(predicate: NamedNode): Literal | null {
    const literals: readonly Literal[] = [
      ...this.resource.values(predicate, Resource.ValueMappers.literal),
    ];

    if (literals.length === 0) {
      return null;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return literal;
    }

    return null;
  }

  get license(): Literal | NamedNode | null {
    const literals: Literal[] = [];

    for (const object of this.resource.values(dcterms.license, (term) =>
      term.termType === "Literal" || term.termType == "NamedNode" ? term : null,
    )) {
      switch (object.termType) {
        case "NamedNode":
          return object;
        case "Literal":
          literals.push(object);
          break;
        default:
          break;
      }
    }

    if (literals.length === 0) {
      return null;
    }
    const literal = literals[0];
    if (
      matchLiteral(literal, {
        includeLanguageTags: this.includeLanguageTags,
      })
    ) {
      return literal;
    }

    return null;
  }

  get modified(): Literal | null {
    return this.resource.optionalValue(
      dcterms.modified,
      Resource.ValueMappers.literal,
    );
  }

  get rights(): Literal | null {
    for (const predicate of rightsPredicates) {
      const value = this.literalObject(predicate);
      if (value !== null) {
        return value;
      }
    }
    return null;
  }

  get rightsHolder(): Literal | null {
    return this.literalObject(dcterms.rightsHolder);
  }
}
