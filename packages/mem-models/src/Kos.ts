import { DatasetCore } from "@rdfjs/types";
import { getRdfInstances } from "./getRdfInstances";
import { Identifier } from "../Identifier";
import { Concept } from "./Concept";
import { skos } from "../../vocabularies";
import { identifierToString } from "../../client/src/utilities/identifierToString";
import { ConceptScheme } from "./ConceptScheme";
import { paginateIterable } from "./paginateIterable";
import { countIterable } from "../../client/src/utilities";
import { LanguageTagSet } from "../LanguageTagSet";

export class Kos {
  readonly dataset: DatasetCore;
  readonly includeLanguageTags: LanguageTagSet;

  constructor({
    dataset,
    includeLanguageTags,
  }: {
    dataset: DatasetCore;
    includeLanguageTags: LanguageTagSet;
  }) {
    this.dataset = dataset;
    this.includeLanguageTags = includeLanguageTags;
  }

  conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(
        new Concept({
          identifier: identifier,
          kos: this,
        }),
      ),
    );
  }

  private *conceptIdentifiers(): Iterable<Identifier> {
    yield* getRdfInstances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  async *concepts(): AsyncGenerator<Concept> {
    for await (const conceptIdentifier of this.conceptIdentifiers()) {
      yield new Concept({
        identifier: conceptIdentifier,
        kos: this,
      });
    }
  }

  conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const conceptIdentifier of paginateIterable(
        this.conceptIdentifiers(),
        { limit, offset },
      )) {
        result.push(
          new Concept({
            identifier: conceptIdentifier,
            kos: this,
          }),
        );
      }
      resolve(result);
    });
  }

  conceptsCount(): Promise<number> {
    return new Promise((resolve) =>
      resolve(countIterable(this.conceptIdentifiers())),
    );
  }

  async conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Promise<ConceptScheme> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return conceptScheme;
      }
    }
    throw new RangeError(identifierToString(identifier));
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => resolve([...this._conceptSchemes()]));
  }

  private *_conceptSchemes(): Iterable<ConceptScheme> {
    for (const identifier of getRdfInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield new ConceptScheme({
        identifier,
        kos: this,
      });
    }
  }
}
