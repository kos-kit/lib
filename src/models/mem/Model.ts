import { NamedNode, Literal } from "@rdfjs/types";
import { dc11, dcterms } from "../../vocabularies";
import { Resource } from "./Resource";
import { Identifier } from "../Identifier";
import { Model as IModel } from "../Model";
import { matchLiteral } from "./matchLiteral";
import { Kos } from "./Kos";
import { LanguageTagSet } from "../LanguageTagSet";

const rightsPredicates = [dcterms.rights, dc11.rights];

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class Model extends Resource implements IModel {
  readonly kos: Kos;

  constructor({ identifier, kos }: { identifier: Identifier; kos: Kos }) {
    super({ dataset: kos.dataset, identifier });
    this.kos = kos;
  }

  protected get includeLanguageTags(): LanguageTagSet {
    return this.kos.includeLanguageTags;
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
