import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Kos as IKos,
  Label as ILabel,
  Identifier,
  abc,
} from "@kos-kit/models";
import { getRdfInstances } from "@kos-kit/rdf-utils";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";

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
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends abc.Kos<ConceptT, ConceptSchemeT, LabelT>
  implements IKos
{
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

  private *allConcepts(): Generator<
    abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    for (const identifier of getRdfInstances({
      class_: skos.Concept,
      dataset: this.dataset,
    })) {
      if (identifier.termType === "NamedNode") {
        yield this.conceptByIdentifier(identifier);
      }
    }
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
      yield* this.allConcepts();
      return;
    }

    // resource skos:topConceptOf conceptScheme entails resource is a skos:Concept because of the
    // domain of skos:topConceptOf
    // resource skos:inScheme conceptScheme does not entail resource is a skos:Concept, since
    // skos:inScheme has an open domain

    let conceptStubs: Iterable<
      abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT>
    >;
    if (query.identifier) {
      conceptStubs = [this.conceptByIdentifier(query.identifier)];
    } else {
      conceptStubs = this.allConcepts();
    }

    for (const conceptStub of conceptStubs) {
      const conceptIdentifier = conceptStub.identifier;

      if (query.inScheme || query.topConceptOf) {
        // Is the concept in the given scheme?

        const isConceptInScheme = (conceptSchemeIdentifier: Identifier) => {
          if (isConceptTopConceptOf(conceptSchemeIdentifier)) {
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

        const isConceptTopConceptOf = (conceptSchemeIdentifier: Identifier) => {
          for (const _ of this.dataset.match(
            conceptIdentifier,
            skos.topConceptOf,
            conceptSchemeIdentifier,
          )) {
            return true;
          }

          for (const _ of this.dataset.match(
            conceptSchemeIdentifier,
            skos.hasTopConcept,
            conceptIdentifier,
          )) {
            return true;
          }

          return false;
        };

        if (query.inScheme && !isConceptInScheme(query.inScheme)) {
          continue;
        }

        if (query.topConceptOf && !isConceptTopConceptOf(query.topConceptOf)) {
          continue;
        }
      }

      if (query.semanticRelationOf) {
        // Is the concept a semantic relation of another concept?
        if (
          this.dataset.match(
            query.semanticRelationOf.subject,
            query.semanticRelationOf.property.identifier,
            conceptStub.identifier,
          ).size === 0
        ) {
          continue;
        }
      }

      yield conceptStub;
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

      if (query.hasConcept && !hasConcept(query.hasConcept)) {
        continue;
      }

      if (query.hasTopConcept && !hasTopConcept(query.hasTopConcept)) {
        continue;
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
