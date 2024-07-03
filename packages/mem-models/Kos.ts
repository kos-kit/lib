import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { instances, isInstanceOf } from "@kos-kit/rdf-utils";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { ModelFactory } from "./ModelFactory.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";
import { Just, Maybe, Nothing } from "purify-ts";

export class Kos<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> implements IKos
{
  private readonly modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;

  readonly dataset: DatasetCore;

  constructor({
    dataset,
    modelFactory,
  }: {
    dataset: DatasetCore;
    modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;
  }) {
    this.dataset = dataset;
    this.modelFactory = modelFactory;
  }

  _conceptByIdentifier(identifier: Resource.Identifier): Maybe<ConceptT> {
    if (
      isInstanceOf({
        class_: skos.Concept,
        dataset: this.dataset,
        instance: identifier,
      })
    ) {
      return Just(
        this.modelFactory.createConcept(
          new Resource({ dataset: this.dataset, identifier }),
        ),
      );
    } else {
      return Nothing;
    }
  }

  conceptByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<Maybe<ConceptT>> {
    return new Promise((resolve) => {
      resolve(this._conceptByIdentifier(identifier));
    });
  }

  async conceptSchemeByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<Maybe<ConceptSchemeT>> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return Just(conceptScheme);
      }
    }
    return Nothing;
  }

  conceptSchemes(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve([...this._conceptSchemes()]);
    });
  }

  async *concepts(): AsyncIterable<ConceptT> {
    for await (const identifier of this.conceptIdentifiers()) {
      yield this.modelFactory.createConcept(
        new Resource({ dataset: this.dataset, identifier }),
      );
    }
  }

  conceptsByIdentifiers(
    identifiers: readonly Resource.Identifier[],
  ): Promise<readonly Maybe<ConceptT>[]> {
    return new Promise((resolve) => {
      resolve(
        identifiers.map((identifier) => this._conceptByIdentifier(identifier)),
      );
    });
  }

  conceptsCount(): Promise<number> {
    return new Promise((resolve) => {
      resolve(countIterable(this.conceptIdentifiers()));
    });
  }

  conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      const result: ConceptT[] = [];
      for (const identifier of paginateIterable(this.conceptIdentifiers(), {
        limit,
        offset,
      })) {
        result.push(
          this.modelFactory.createConcept(
            new Resource({ dataset: this.dataset, identifier }),
          ),
        );
      }
      resolve(result);
    });
  }

  private *_conceptSchemes(): Iterable<ConceptSchemeT> {
    for (const identifier of instances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield this.modelFactory.createConceptScheme(
        new Resource({ dataset: this.dataset, identifier }),
      );
    }
  }

  private *conceptIdentifiers(): Iterable<Resource.Identifier> {
    yield* instances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }
}
