import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { instances } from "@kos-kit/rdf-utils";
import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { ModelFactory } from "./ModelFactory.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

export class Kos<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends ILabel,
> implements IKos
{
  readonly dataset: DatasetCore;
  private readonly modelFactory: ModelFactory<ConceptT, ConceptSchemeT, LabelT>;

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

  conceptByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<O.Option<ConceptT>> {
    return new Promise((resolve) => {
      resolve(O.some(this.modelFactory.createConcept(identifier)));
    });
  }

  private *conceptIdentifiers(): Iterable<Resource.Identifier> {
    yield* instances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  async *concepts(): AsyncIterable<ConceptT> {
    for await (const identifier of this.conceptIdentifiers()) {
      yield this.modelFactory.createConcept(identifier);
    }
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
        result.push(this.modelFactory.createConcept(identifier));
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
  ): Promise<O.Option<ConceptSchemeT>> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return O.some(conceptScheme);
      }
    }
    return O.none;
  }

  conceptSchemes(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve([...this._conceptSchemes()]);
    });
  }

  private *_conceptSchemes(): Iterable<ConceptSchemeT> {
    for (const identifier of instances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield this.modelFactory.createConceptScheme(identifier);
    }
  }
}
