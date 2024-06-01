import { NamedNode, Literal, DatasetCore } from "@rdfjs/types";
import { dc11, dcterms } from "../../vocabularies";
import { Resource } from "./Resource";
import { LanguageTagSet } from "../LanguageTagSet";
import { Identifier } from "../Identifier";
import { Model as IModel } from "../Model";

const rightsPredicates = [dcterms.rights, dc11.rights];

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class Model extends Resource implements IModel {
  protected readonly includeLanguageTags: LanguageTagSet;

  constructor({
    dataset,
    identifier,
    includeLanguageTags,
  }: {
    dataset: DatasetCore;
    identifier: Identifier;
    includeLanguageTags: LanguageTagSet;
  }) {
    super({ dataset, identifier });
    this.includeLanguageTags = includeLanguageTags;
  }

  private literalObject(predicate: NamedNode): Literal | null {
    const literals: readonly Literal[] = [
      ...this.filterAndMapObjects(predicate, (term) =>
        term.termType === "Literal" ? term : null,
      ),
    ];

    if (literals.length === 0) {
      return null;
    }

    if (this.includeLanguageTags.size === 0) {
      return literals[0];
    }

    for (const languageTag of this.includeLanguageTags) {
      for (const literal of literals) {
        if (literal.language === languageTag) {
          return literal;
        }
      }
    }

    return null;
  }

  get license(): Literal | NamedNode | null {
    const literals: Literal[] = [];

    for (const quad of this.dataset.match(
      this.identifier,
      dcterms.license,
      null,
    )) {
      switch (quad.object.termType) {
        case "NamedNode":
          return quad.object;
        case "Literal":
          literals.push(quad.object);
          break;
        default:
          break;
      }
    }

    if (literals.length === 0) {
      return null;
    }
    if (this.includeLanguageTags.size === 0) {
      return literals[0];
    }

    for (const languageTag of this.includeLanguageTags) {
      for (const literal of literals) {
        if (literal.language === languageTag) {
          return literal;
        }
      }
    }

    return null;
  }

  get modified(): Literal | null {
    return this.findAndMapObjectOptional(dcterms.modified, (term) =>
      term.termType === "Literal" ? term : null,
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
