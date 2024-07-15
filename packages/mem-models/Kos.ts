import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { getRdfNamedInstances, isRdfInstanceOf } from "@kos-kit/rdf-utils";
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

  _conceptByIdentifier(identifier: IConcept.Identifier): Maybe<ConceptT> {
    if (
      isRdfInstanceOf({
        class_: skos.Concept,
        dataset: this.dataset,
        instance: identifier,
      })
    ) {
      return Just(
        this.modelFactory.createConcept(
          new Resource({
            dataset: this.dataset,
            identifier,
          }),
        ),
      );
    } else {
      return Nothing;
    }
  }

  async conceptByIdentifier(
    identifier: IConcept.Identifier,
  ): Promise<Maybe<ConceptT>> {
    return this._conceptByIdentifier(identifier);
  }

  async conceptSchemeByIdentifier(
    identifier: IConceptScheme.Identifier,
  ): Promise<Maybe<ConceptSchemeT>> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return Just(conceptScheme);
      }
    }
    return Nothing;
  }

  async conceptSchemes(): Promise<readonly ConceptSchemeT[]> {
    return [...this._conceptSchemes()];
  }

  async *concepts(): AsyncIterable<ConceptT> {
    for await (const identifier of this.conceptIdentifiers()) {
      yield this.modelFactory.createConcept(
        new Resource({ dataset: this.dataset, identifier }),
      );
    }
  }

  async conceptsByIdentifiers(
    identifiers: readonly IConcept.Identifier[],
  ): Promise<readonly Maybe<ConceptT>[]> {
    return identifiers.map((identifier) =>
      this._conceptByIdentifier(identifier),
    );
  }

  async conceptsCount(): Promise<number> {
    return countIterable(this.conceptIdentifiers());
  }

  async conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
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
    return result;
  }

  private *_conceptSchemes(): Iterable<ConceptSchemeT> {
    for (const identifier of getRdfNamedInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield this.modelFactory.createConceptScheme(
        new Resource({
          dataset: this.dataset,
          identifier,
        }),
      );
    }
  }

  private *conceptIdentifiers(): Iterable<IConcept.Identifier> {
    yield* getRdfNamedInstances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }
}
