import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
  Identifier,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { getRdfInstances } from "@kos-kit/rdf-utils";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { ModelFactory } from "./ModelFactory.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

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
    identifier: Identifier,
  ): ConceptStub<ConceptT, ConceptSchemeT, LabelT> {
    return new ConceptStub({
      modelFactory: this.modelFactory,
      resource: new Resource({ dataset: this.dataset, identifier }),
    });
  }

  conceptSchemeByIdentifier(
    identifier: Identifier,
  ): ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT> {
    return new ConceptSchemeStub({
      modelFactory: this.modelFactory,
      resource: new Resource({ dataset: this.dataset, identifier }),
    });
  }

  async *conceptSchemes(): AsyncGenerator<
    ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    for (const identifier of getRdfInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
    })) {
      if (identifier.termType !== "NamedNode") {
        continue;
      }
      yield new ConceptSchemeStub({
        modelFactory: this.modelFactory,
        resource: new Resource({ dataset: this.dataset, identifier }),
      });
    }
  }

  async *concepts(): AsyncGenerator<
    ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    for await (const identifier of this.conceptIdentifiers()) {
      yield new ConceptStub({
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
  }): Promise<readonly ConceptStub<ConceptT, ConceptSchemeT, LabelT>[]> {
    const result: ConceptStub<ConceptT, ConceptSchemeT, LabelT>[] = [];
    for (const identifier of paginateIterable(this.conceptIdentifiers(), {
      limit,
      offset,
    })) {
      result.push(
        new ConceptStub({
          modelFactory: this.modelFactory,
          resource: new Resource({ dataset: this.dataset, identifier }),
        }),
      );
    }
    return result;
  }

  private *conceptIdentifiers(): Generator<Identifier> {
    for (const identifier of getRdfInstances({
      class_: skos.Concept,
      dataset: this.dataset,
    })) {
      if (identifier.termType === "NamedNode") {
        yield identifier;
      }
    }
  }
}
