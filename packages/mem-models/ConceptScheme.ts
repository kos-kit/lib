import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

export class ConceptScheme<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel<LabelT>
  implements IConceptScheme
{
  private readonly createConcept: Concept.Parameters<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >["createConcept"];

  constructor({
    createConcept,
    ...labeledModelParameters
  }: ConceptScheme.Parameters<ConceptT, LabelT>) {
    super(labeledModelParameters);
    this.createConcept = createConcept;
  }

  conceptByIdentifier(
    identifier: Resource.Identifier,
  ): Promise<O.Option<ConceptT>> {
    return new Promise((resolve) => {
      for (const _ of this.resource.dataset.match(
        this.identifier,
        skos.hasTopConcept,
        identifier,
      )) {
        resolve(O.some(this.createConcept(identifier)));
        return;
      }

      for (const predicate of [skos.inScheme, skos.topConceptOf]) {
        for (const _ of this.resource.dataset.match(
          identifier,
          predicate,
          this.identifier,
        )) {
          resolve(O.some(this.createConcept(identifier)));
          return;
        }
      }
    });
  }

  async *concepts(): AsyncIterable<ConceptT> {
    yield* this._concepts({ topOnly: false });
  }

  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return this._conceptsPage({ ...kwds, topOnly: false });
  }

  conceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: false });
  }

  private *_conceptIdentifiers({
    topOnly,
  }: {
    topOnly: boolean;
  }): Iterable<Resource.Identifier> {
    const conceptIdentifierSet = new TermSet<Resource.Identifier>();

    // ConceptScheme -> Concept statement
    for (const conceptIdentifier of this.resource.values(
      skos.hasTopConcept,
      Resource.ValueMappers.identifier,
    )) {
      if (!conceptIdentifierSet.has(conceptIdentifier)) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }

    // Concept -> ConceptScheme statement
    for (const predicate of topOnly
      ? [skos.topConceptOf]
      : [skos.inScheme, skos.topConceptOf])
      for (const quad of this.resource.dataset.match(
        null,
        predicate,
        this.identifier,
      )) {
        const conceptIdentifier = O.toNullable(
          Resource.ValueMappers.identifier(
            quad.subject as BlankNode | NamedNode,
          ),
        );
        if (
          conceptIdentifier !== null &&
          !conceptIdentifierSet.has(conceptIdentifier)
        ) {
          yield conceptIdentifier;
          conceptIdentifierSet.add(conceptIdentifier);
        }
      }
  }

  async *_concepts({ topOnly }: { topOnly: boolean }): AsyncIterable<ConceptT> {
    for await (const identifier of this._conceptIdentifiers({ topOnly })) {
      yield this.createConcept(identifier);
    }
  }

  _conceptsPage({
    limit,
    offset,
    topOnly,
  }: {
    limit: number;
    offset: number;
    topOnly: boolean;
  }): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      const result: ConceptT[] = [];
      for (const identifier of paginateIterable(
        this._conceptIdentifiers({ topOnly }),
        {
          limit,
          offset,
        },
      )) {
        result.push(this.createConcept(identifier));
      }
      resolve(result);
    });
  }

  _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return new Promise((resolve) => {
      resolve(countIterable(this._conceptIdentifiers({ topOnly })));
    });
  }

  async *topConcepts(): AsyncIterable<ConceptT> {
    yield* this._concepts({ topOnly: true });
  }

  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly ConceptT[]> {
    return this._conceptsPage({ ...kwds, topOnly: true });
  }

  topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }
}

export namespace ConceptScheme {
  export interface Parameters<ConceptT extends IConcept, LabelT extends ILabel>
    extends LabeledModel.Parameters<LabelT> {
    createConcept(identifier: Resource.Identifier): ConceptT;
  }
}
