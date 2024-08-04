import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { getRdfInstances } from "@kos-kit/rdf-utils";
import TermSet from "@rdfjs/term-set";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";

function isConceptInScheme({
  conceptIdentifier,
  conceptSchemeIdentifier,
  dataset,
}: {
  conceptIdentifier: Identifier;
  conceptSchemeIdentifier: Identifier;
  dataset: DatasetCore;
}) {
  if (
    isConceptTopConceptOf({
      conceptIdentifier,
      conceptSchemeIdentifier,
      dataset,
    })
  ) {
    return true;
  }

  for (const _ of dataset.match(
    conceptIdentifier,
    skos.inScheme,
    conceptSchemeIdentifier,
  )) {
    return true;
  }

  return false;
}

function isConceptTopConceptOf({
  conceptIdentifier,
  conceptSchemeIdentifier,
  dataset,
}: {
  conceptIdentifier: Identifier;
  conceptSchemeIdentifier: Identifier;
  dataset: DatasetCore;
}) {
  for (const _ of dataset.match(
    conceptIdentifier,
    skos.topConceptOf,
    conceptSchemeIdentifier,
  )) {
    return true;
  }

  for (const _ of dataset.match(
    conceptSchemeIdentifier,
    skos.hasTopConcept,
    conceptIdentifier,
  )) {
    return true;
  }

  return false;
}

function* limitGenerator<T>(
  generator: Generator<T>,
  limit: number,
): Generator<T> {
  if (limit <= 0) {
    yield* generator;
    return;
  }

  let yieldedItemCount = 0;
  for (const item of generator) {
    yield item;
    if (++yieldedItemCount === limit) {
      return;
    }
  }
}

function* offsetGenerator<T>(
  generator: Generator<T>,
  offset: number,
): Generator<T> {
  if (offset <= 0) {
    yield* generator;
    return;
  }

  let itemI = 0;
  for (const item of generator) {
    if (itemI++ >= offset) {
      yield item;
    }
  }
}

export abstract class Kos<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends abc.Kos<ConceptT, ConceptSchemeT, LabelT> {
  readonly dataset: DatasetCore;

  constructor({ dataset, ...otherParameters }: Kos.Parameters) {
    super(otherParameters);
    this.dataset = dataset;
  }

  async *concepts(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptsQuery;
  }): AsyncGenerator<abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT>> {
    let concepts = this.queryConcepts(kwds?.query);
    if (kwds?.offset) {
      concepts = offsetGenerator(concepts, kwds.offset);
    }
    if (kwds?.limit) {
      concepts = limitGenerator(concepts, kwds.limit);
    }
    yield* concepts;
  }

  override async conceptsCount(query?: ConceptsQuery): Promise<number> {
    return this.queryConcepts(query).count();
  }

  async *conceptSchemes(kwds?: {
    limit?: number;
    offset?: number;
    query?: ConceptSchemesQuery;
  }): AsyncGenerator<abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>> {
    let conceptSchemes = this.queryConceptSchemes(kwds?.query);
    if (kwds?.offset) {
      conceptSchemes = offsetGenerator(conceptSchemes, kwds.offset);
    }
    if (kwds?.limit) {
      conceptSchemes = limitGenerator(conceptSchemes, kwds.limit);
    }
    yield* conceptSchemes;
  }

  override async conceptSchemesCount(
    query?: ConceptSchemesQuery,
  ): Promise<number> {
    return this.queryConceptSchemes(query).count();
  }

  private *allConceptSchemes(): Generator<
    abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    for (const identifier of getRdfInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
    })) {
      if (identifier.termType === "NamedNode") {
        yield this.conceptSchemeByIdentifier(identifier);
      }
    }
  }

  private *queryConcepts(
    query?: ConceptsQuery,
  ): Generator<abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT>> {
    if (!query) {
      for (const identifier of getRdfInstances({
        class_: skos.Concept,
        dataset: this.dataset,
      })) {
        if (identifier.termType === "NamedNode") {
          yield this.conceptByIdentifier(identifier);
        }
      }
      return;
    }

    if (query.type === "InScheme" && query.conceptIdentifier) {
      if (
        isConceptInScheme({
          conceptIdentifier: query.conceptIdentifier,
          conceptSchemeIdentifier: query.conceptSchemeIdentifier,
          dataset: this.dataset,
        })
      ) {
        yield this.conceptByIdentifier(query.conceptIdentifier);
      }
      return;
    }

    if (query.type === "InScheme" || query.type === "TopConceptOf") {
      const yieldedConceptIdentifiers = new TermSet<Identifier>();

      for (const quad of this.dataset.match(
        query.conceptSchemeIdentifier,
        skos.hasTopConcept,
      )) {
        // conceptScheme skos:hasTopConcept resource entails resource is a skos:Concept because of
        // the range of skos:hasTopConcept
        if (
          quad.object.termType === "NamedNode" &&
          !yieldedConceptIdentifiers.has(quad.object)
        ) {
          yield this.conceptByIdentifier(quad.object);
          yieldedConceptIdentifiers.add(quad.object);
        }
      }

      for (const quad of this.dataset.match(
        null,
        skos.topConceptOf,
        query.conceptSchemeIdentifier,
      )) {
        // resource skos:topConceptOf conceptScheme entails resource is a skos:Concept because of the
        // domain of skos:topConceptOf
        if (
          quad.subject.termType === "NamedNode" &&
          !yieldedConceptIdentifiers.has(quad.subject)
        ) {
          yield this.conceptByIdentifier(quad.subject);
          yieldedConceptIdentifiers.add(quad.subject);
        }
      }

      if (query.type === "InScheme") {
        for (const quad of this.dataset.match(
          null,
          skos.inScheme,
          query.conceptSchemeIdentifier,
        )) {
          if (quad.subject.termType !== "NamedNode") {
            continue;
          }
          if (yieldedConceptIdentifiers.has(quad.subject)) {
            continue;
          }
          // resource skos:inScheme conceptScheme does not entail resource is a skos:Concept, since
          // skos:inScheme has an open domain
          if (
            !new Resource({
              dataset: this.dataset,
              identifier: quad.subject,
            }).isInstanceOf(skos.Concept)
          ) {
            continue;
          }
          yield this.conceptByIdentifier(quad.subject);
          yieldedConceptIdentifiers.add(quad.subject);
        }
      }
      return;
    }

    // Semantic relation query
    for (const quad of this.dataset.match(
      query.subjectConceptIdentifier,
      query.semanticRelationProperty.identifier,
      null,
    )) {
      // The semantic relation properties have a range of skos:Concept
      if (quad.object.termType === "NamedNode") {
        yield this.conceptByIdentifier(quad.object);
      }
    }
  }

  private *queryConceptSchemes(
    query?: ConceptSchemesQuery,
  ): Generator<abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>> {
    if (!query) {
      yield* this.allConceptSchemes();
      return;
    }

    for (const conceptSchemeStub of this.allConceptSchemes()) {
      const conceptSchemeIdentifier = conceptSchemeStub.identifier;

      const hasConcept = (conceptIdentifier: Identifier) => {
        if (hasTopConcept(conceptIdentifier)) {
          return true;
        }

        for (const _ of this.dataset.match(
          conceptIdentifier,
          skos.inScheme,
          conceptSchemeIdentifier,
        )) {
          return true;
        }

        return false;
      };

      const hasTopConcept = (conceptIdentifier: Identifier) => {
        for (const _ of this.dataset.match(
          conceptSchemeIdentifier,
          skos.hasTopConcept,
          conceptIdentifier,
        )) {
          return true;
        }
        for (const _ of this.dataset.match(
          conceptIdentifier,
          skos.topConceptOf,
          conceptSchemeIdentifier,
        )) {
          return true;
        }
        return false;
      };

      switch (query.type) {
        case "HasConcept":
          if (!hasConcept(query.conceptIdentifier)) {
            continue;
          }
          break;
        case "HasTopConcept":
          if (!hasTopConcept(query.conceptIdentifier)) {
            continue;
          }
          break;
      }

      yield conceptSchemeStub;
    }
  }
}

export namespace Kos {
  export interface Parameters extends abc.Kos.Parameters {
    dataset: DatasetCore;
  }
}
