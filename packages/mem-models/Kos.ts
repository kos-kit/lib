import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { getRdfNamedInstances } from "@kos-kit/rdf-utils";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { ModelFactory } from "./ModelFactory.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";
import { StubConcept } from "./StubConcept.js";
import { StubConceptScheme } from "./StubConceptScheme.js";
import { Maybe } from "purify-ts";

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

  conceptByIdentifier(
    identifier: IConcept.Identifier,
  ): Promise<Maybe<ConceptT>> {
    return new StubConcept({
      modelFactory: this.modelFactory,
      resource: new Resource({ dataset: this.dataset, identifier }),
    }).resolve();
  }

  conceptSchemeByIdentifier(
    identifier: IConceptScheme.Identifier,
  ): Promise<Maybe<ConceptSchemeT>> {
    return new StubConceptScheme({
      modelFactory: this.modelFactory,
      resource: new Resource({ dataset: this.dataset, identifier }),
    }).resolve();
  }

  async conceptSchemes(): Promise<
    readonly StubConceptScheme<ConceptT, ConceptSchemeT, LabelT>[]
  > {
    const result: StubConceptScheme<ConceptT, ConceptSchemeT, LabelT>[] = [];
    for (const identifier of getRdfNamedInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      result.push(
        new StubConceptScheme({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
      );
    }
    return result;
  }

  async *concepts(): AsyncIterable<
    StubConcept<ConceptT, ConceptSchemeT, LabelT>
  > {
    for await (const identifier of this.conceptIdentifiers()) {
      yield new StubConcept({
        modelFactory: this.modelFactory,
        resource: new Resource({ dataset: this.dataset, identifier }),
      });
    }
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
  }): Promise<readonly StubConcept<ConceptT, ConceptSchemeT, LabelT>[]> {
    const result: StubConcept<ConceptT, ConceptSchemeT, LabelT>[] = [];
    for (const identifier of paginateIterable(this.conceptIdentifiers(), {
      limit,
      offset,
    })) {
      result.push(
        new StubConcept({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
      );
    }
    return result;
  }

  private *conceptIdentifiers(): Iterable<IConcept.Identifier> {
    yield* getRdfNamedInstances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }
}
