import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { paginateIterable } from "./paginateIterable";
import { LanguageTagSet } from "@kos-kit/models";
import { skos } from "@kos-kit/vocabularies";
import { Resource } from "@kos-kit/rdf-resource";
import { instances } from "@kos-kit/rdf-utils";
import { countIterable } from "./countIterable";

export class Kos {
  private readonly dataset: DatasetCore;
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

  conceptByIdentifier(identifier: BlankNode | NamedNode): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(
        new Concept({
          kos: this,
          resource: new Resource({
            dataset: this.dataset,
            identifier,
          }),
        }),
      ),
    );
  }

  private *conceptIdentifiers(): Iterable<BlankNode | NamedNode> {
    yield* instances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  async *concepts(): AsyncGenerator<Concept> {
    for await (const identifier of this.conceptIdentifiers()) {
      yield new Concept({
        kos: this,
        resource: new Resource({ dataset: this.dataset, identifier }),
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
      for (const identifier of paginateIterable(this.conceptIdentifiers(), {
        limit,
        offset,
      })) {
        result.push(
          new Concept({
            kos: this,
            resource: new Resource({ dataset: this.dataset, identifier }),
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
      yield new ConceptScheme({
        kos: this,
        resource: new Resource({ dataset: this.dataset, identifier }),
      });
    }
  }
}
