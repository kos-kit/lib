import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { paginateIterable } from "./paginateIterable.js";
import { Kos as IKos, LanguageTagSet } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Resource } from "@kos-kit/rdf-resource";
import { instances } from "@kos-kit/rdf-utils";
import { countIterable } from "./countIterable.js";
import * as O from "fp-ts/Option";

export class Kos implements IKos {
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

  conceptByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<O.Option<Concept>> {
    return new Promise((resolve) => {
      resolve(O.some(new Concept({ identifier, kos: this })));
    });
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
    return new Promise((resolve) => {
      resolve(countIterable(this.conceptIdentifiers()));
    });
  }

  async conceptSchemeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<O.Option<ConceptScheme>> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return O.some(conceptScheme);
      }
    }
    return O.none;
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => {
      resolve([...this._conceptSchemes()]);
    });
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
