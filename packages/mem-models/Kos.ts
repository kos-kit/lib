import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { instances } from "@kos-kit/rdf-utils";
import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Label } from "./Label.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

export class Kos<
  ConceptT extends IConcept,
  ConceptSchemeT extends IConceptScheme,
  LabelT extends Label,
> implements IKos
{
  readonly conceptFactory: Concept.Factory<ConceptT, ConceptSchemeT, LabelT>;
  readonly conceptSchemeFactory: ConceptScheme.Factory<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >;
  readonly dataset: DatasetCore;
  readonly includeLanguageTags: LanguageTagSet;
  readonly labelFactory: Label.Factory<LabelT>;

  constructor({
    conceptFactory,
    conceptSchemeFactory,
    dataset,
    includeLanguageTags,
    labelFactory,
  }: {
    readonly conceptFactory: Concept.Factory<ConceptT, ConceptSchemeT, LabelT>;
    readonly conceptSchemeFactory: ConceptScheme.Factory<
      ConceptT,
      ConceptSchemeT,
      LabelT
    >;
    dataset: DatasetCore;
    includeLanguageTags: LanguageTagSet;
    readonly labelFactory: Label.Factory<LabelT>;
  }) {
    this.conceptFactory = conceptFactory;
    this.conceptSchemeFactory = conceptSchemeFactory;
    this.dataset = dataset;
    this.includeLanguageTags = includeLanguageTags;
    this.labelFactory = labelFactory;
  }

  conceptByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<O.Option<ConceptT>> {
    return new Promise((resolve) => {
      resolve(O.some(this.createConcept(identifier)));
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
      yield this.createConcept(identifier);
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
        result.push(this.createConcept(identifier));
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
      yield this.createConceptScheme(identifier);
    }
  }

  protected createConcept(identifier: BlankNode | NamedNode): ConceptT {
    return new this.conceptFactory({
      conceptFactory: this.conceptFactory,
      conceptSchemeFactory: this.conceptSchemeFactory,
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      labelFactory: this.labelFactory,
    });
  }

  protected createConceptScheme(
    identifier: BlankNode | NamedNode,
  ): ConceptSchemeT {
    return new this.conceptSchemeFactory({
      conceptFactory: this.conceptFactory,
      conceptSchemeFactory: this.conceptSchemeFactory,
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      labelFactory: this.labelFactory,
    });
  }
}
