import { ConceptScheme as IConceptScheme } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { Concept } from "./Concept.js";
import { LabeledModel } from "./LabeledModel.js";
import { countIterable } from "./countIterable.js";
import { paginateIterable } from "./paginateIterable.js";

export class ConceptScheme extends LabeledModel implements IConceptScheme {
  conceptByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Promise<O.Option<Concept>> {
    return new Promise((resolve) => {
      for (const _ of this.resource.dataset.match(
        this.identifier,
        skos.hasTopConcept,
        identifier,
      )) {
        resolve(
          O.some(
            this.kos.modelFactory.createConcept({
              identifier,
              kos: this.kos,
            }),
          ),
        );
        return;
      }

      for (const predicate of [skos.inScheme, skos.topConceptOf]) {
        for (const _ of this.resource.dataset.match(
          identifier,
          predicate,
          this.identifier,
        )) {
          resolve(
            O.some(
              this.kos.modelFactory.createConcept({
                identifier,
                kos: this.kos,
              }),
            ),
          );
          return;
        }
      }
    });
  }

  async *concepts(): AsyncIterable<Concept> {
    yield* this._concepts({ topOnly: false });
  }

  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
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

  async *_concepts({ topOnly }: { topOnly: boolean }): AsyncIterable<Concept> {
    for await (const identifier of this._conceptIdentifiers({ topOnly })) {
      yield this.kos.modelFactory.createConcept({
        identifier,
        kos: this.kos,
      });
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
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const identifier of paginateIterable(
        this._conceptIdentifiers({ topOnly }),
        {
          limit,
          offset,
        },
      )) {
        result.push(
          this.kos.modelFactory.createConcept({
            identifier,
            kos: this.kos,
          }),
        );
      }
      resolve(result);
    });
  }

  _conceptsCount({ topOnly }: { topOnly: boolean }): Promise<number> {
    return new Promise((resolve) => {
      resolve(countIterable(this._conceptIdentifiers({ topOnly })));
    });
  }

  async *topConcepts(): AsyncIterable<Concept> {
    yield* this._concepts({ topOnly: true });
  }

  topConceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return this._conceptsPage({ ...kwds, topOnly: true });
  }

  topConceptsCount(): Promise<number> {
    return this._conceptsCount({ topOnly: true });
  }
}
