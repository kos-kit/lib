import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  Stub,
  StubSequence,
  UnbatchedStubSequence,
  abc,
} from "@kos-kit/models";
import TermSet from "@rdfjs/term-set";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Resource, ResourceSet } from "rdfjs-resource";

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

export abstract class Kos<
  ConceptT extends IConcept<ConceptT, ConceptSchemeT, LabelT>,
  ConceptSchemeT extends IConceptScheme<ConceptT, LabelT>,
  LabelT extends ILabel,
> extends abc.Kos<ConceptT, ConceptSchemeT, LabelT> {
  readonly resourceSet: ResourceSet;

  constructor({ dataset, ...otherParameters }: Kos.Parameters) {
    super(otherParameters);
    this.resourceSet = new ResourceSet({ dataset });
  }

  get dataset(): DatasetCore {
    return this.resourceSet.dataset;
  }

  async conceptSchemesByQuery({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>> {
    return new UnbatchedStubSequence(
      this.sortConceptSchemes(this.queryConceptSchemes(query)).slice(
        offset,
        limit !== null ? offset + limit : undefined,
      ),
    );
  }

  override async conceptSchemesCountByQuery(
    query: ConceptSchemesQuery,
  ): Promise<number> {
    let count = 0;
    for (const _ of this.queryConceptSchemes(query)) {
      count++;
    }
    return count;
  }

  async conceptsByQuery({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>> {
    return new UnbatchedStubSequence(
      this.sortConcepts(this.queryConcepts(query)).slice(
        offset,
        limit !== null ? offset + limit : undefined,
      ),
    );
  }

  override async conceptsCountByQuery(query: ConceptsQuery): Promise<number> {
    let count = 0;
    for (const _ of this.queryConcepts(query)) {
      count++;
    }
    return count;
  }

  private *allConceptSchemes(): Generator<Stub<ConceptSchemeT>> {
    for (const resource of this.resourceSet.namedInstancesOf(
      skos.ConceptScheme,
    )) {
      yield this.conceptScheme(resource.identifier);
    }
  }

  private *queryConceptSchemes(
    query: ConceptSchemesQuery,
  ): Generator<Stub<ConceptSchemeT>> {
    if (query.type === "All") {
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

  private *queryConcepts(query: ConceptsQuery): Generator<Stub<ConceptT>> {
    if (query.type === "All") {
      for (const resource of this.resourceSet.namedInstancesOf(skos.Concept)) {
        yield this.concept(resource.identifier);
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
        yield this.concept(query.conceptIdentifier);
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
          yield this.concept(quad.object);
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
          yield this.concept(quad.subject);
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
          yield this.concept(quad.subject);
          yieldedConceptIdentifiers.add(quad.subject);
        }
      }
      return;
    }

    if (query.type === "ObjectsOfSemanticRelation") {
      for (const quad of this.dataset.match(
        query.subjectConceptIdentifier,
        query.semanticRelationType.property,
        null,
      )) {
        // The semantic relation properties have a range of skos:Concept
        if (quad.object.termType === "NamedNode") {
          yield this.concept(quad.object);
        }
      }
      return;
    }

    if (query.type === "SubjectsOfSemanticRelation") {
      for (const quad of this.dataset.match(
        null,
        query.semanticRelationType.property,
        query.objectConceptIdentifier,
      )) {
        // The semantic relation properties have a domain of skos:Concept
        if (quad.subject.termType === "NamedNode") {
          yield this.concept(quad.subject);
        }
      }
      return;
    }

    throw new RangeError("should never reach this code");
  }

  private sortConceptSchemes(
    conceptSchemeStubs: Iterable<Stub<ConceptSchemeT>>,
  ): readonly Stub<ConceptSchemeT>[] {
    const sortedConceptSchemeStubs = [...conceptSchemeStubs];
    sortedConceptSchemeStubs.sort((left, right) =>
      left.identifier.value.localeCompare(right.identifier.value),
    );
    return sortedConceptSchemeStubs;
  }

  private sortConcepts(
    conceptStubs: Iterable<Stub<ConceptT>>,
  ): readonly Stub<ConceptT>[] {
    const sortedConceptStubs = [...conceptStubs];
    sortedConceptStubs.sort((left, right) =>
      left.identifier.value.localeCompare(right.identifier.value),
    );
    return sortedConceptStubs;
  }
}

export namespace Kos {
  export interface Parameters extends abc.Kos.Parameters {
    dataset: DatasetCore;
  }
}
