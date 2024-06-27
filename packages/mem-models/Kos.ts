import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
  LanguageTagSet,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { instances } from "@kos-kit/rdf-utils";
import { BlankNode, DatasetCore, Literal, NamedNode } from "@rdfjs/types";
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
  LabelT extends ILabel,
> implements IKos
{
  private readonly conceptConstructor: new (
    parameters: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
  ) => ConceptT;
  private readonly conceptSchemeConstructor: new (
    parameters: ConceptScheme.Parameters<ConceptT, LabelT>,
  ) => ConceptSchemeT;
  readonly dataset: DatasetCore;
  readonly includeLanguageTags: LanguageTagSet;
  private readonly labelConstructor: new (
    parameters: Label.Parameters,
  ) => LabelT;

  constructor({
    conceptConstructor,
    conceptSchemeConstructor,
    dataset,
    includeLanguageTags,
    labelConstructor,
  }: {
    conceptConstructor: new (
      parameters: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>,
    ) => ConceptT;
    conceptSchemeConstructor: new (
      parameters: ConceptScheme.Parameters<ConceptT, LabelT>,
    ) => ConceptSchemeT;
    dataset: DatasetCore;
    includeLanguageTags: LanguageTagSet;
    labelConstructor: new (parameters: Label.Parameters) => LabelT;
  }) {
    this.conceptConstructor = conceptConstructor;
    this.conceptSchemeConstructor = conceptSchemeConstructor;
    this.dataset = dataset;
    this.includeLanguageTags = includeLanguageTags;
    this.labelConstructor = labelConstructor;
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

  protected createConcept(identifier: Resource.Identifier): ConceptT {
    return new this.conceptConstructor({
      createConcept: this.createConcept,
      createConceptScheme: this.createConceptScheme,
      createLabel: this.createLabel,
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
    });
  }

  protected createConceptScheme(
    identifier: Resource.Identifier,
  ): ConceptSchemeT {
    return new this.conceptSchemeConstructor({
      createConcept: this.createConcept,
      createLabel: this.createLabel,
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
    });
  }

  protected createLabel({
    identifier,
    literalForm,
  }: {
    identifier: Resource.Identifier;
    literalForm: Literal;
  }): LabelT {
    return new this.labelConstructor({
      dataset: this.dataset,
      identifier,
      includeLanguageTags: this.includeLanguageTags,
      literalForm,
    });
  }
}
