import { NamedNode, Literal } from "@rdfjs/types";
import { LanguageTag } from "../LanguageTag";
import { dc11, dcterms } from "../../vocabularies";
import { Resource } from "./Resource";

const rightsPredicates = [dcterms.rights, dc11.rights];

/**
 * Abstract base class for RDF/JS Dataset-backed models.
 */
export abstract class Model extends Resource {
  private languageTaggedLiteralObject(
    languageTag: LanguageTag,
    predicate: NamedNode,
  ): Literal | null {
    let untaggedLiteralValue: Literal | null = null;
    for (const quad of this.dataset.match(this.identifier, predicate, null)) {
      if (quad.object.termType !== "Literal") {
        continue;
      }
      if (quad.object.language === languageTag) {
        return quad.object;
      } else if (quad.object.language.length === 0) {
        untaggedLiteralValue = quad.object;
      }
    }
    return untaggedLiteralValue;
  }

  license(languageTag: LanguageTag): Promise<Literal | NamedNode | null> {
    return new Promise((resolve) => {
      let untaggedLiteralValue: Literal | null = null;

      for (const quad of this.dataset.match(
        this.identifier,
        dcterms.license,
        null,
      )) {
        switch (quad.object.termType) {
          case "NamedNode":
            resolve(quad.object);
            return;
          case "Literal":
            if (quad.object.language === languageTag) {
              resolve(quad.object);
              return;
            } else if (quad.object.language.length === 0) {
              untaggedLiteralValue = quad.object;
            }
            break;
          default:
            break;
        }
      }

      resolve(untaggedLiteralValue);
    });
  }

  modified(): Promise<Literal | null> {
    return new Promise((resolve) =>
      resolve(
        this.findAndMapObjectOptional(dcterms.modified, (term) =>
          term.termType === "Literal" ? term : null,
        ),
      ),
    );
  }

  rights(languageTag: LanguageTag): Promise<Literal | null> {
    return new Promise((resolve) => {
      for (const predicate of rightsPredicates) {
        const value = this.languageTaggedLiteralObject(languageTag, predicate);
        if (value !== null) {
          resolve(value);
          return;
        }
      }
      resolve(null);
    });
  }

  rightsHolder(languageTag: LanguageTag): Promise<Literal | null> {
    return new Promise((resolve) =>
      resolve(
        this.languageTaggedLiteralObject(languageTag, dcterms.rightsHolder),
      ),
    );
  }
}
