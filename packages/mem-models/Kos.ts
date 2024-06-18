import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { paginateIterable } from "./paginateIterable";
import { LanguageTagSet } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Resource } from "@kos-kit/rdf-resource";
import { instances } from "@kos-kit/rdf-utils";
import { countIterable } from "./countIterable";

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

  conceptByIdentifier(identifier: Resource.Identifier): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(new Concept({ identifier, kos: this })),
    );
  }

  private *conceptIdentifiers(): Iterable<Resource.Identifier> {
    yield* instances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  async *concepts(): AsyncGenerator<Concept> {
    for await (const identifier of this.conceptIdentifiers()) {
      yield new Concept({ identifier, kos: this });
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
      for (const identifier of paginateIterable(this.conceptIdentifiers(), {
        limit,
        offset,
      })) {
        result.push(new Concept({ identifier, kos: this }));
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
    identifier: BlankNode | NamedNode,
  ): Promise<ConceptScheme> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return conceptScheme;
      }
    }
    throw new RangeError(Resource.Identifier.toString(identifier));
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => resolve([...this._conceptSchemes()]));
  }

  private *_conceptSchemes(): Iterable<ConceptScheme> {
    for (const identifier of instances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield new ConceptScheme({ identifier, kos: this });
    }
  }
}
