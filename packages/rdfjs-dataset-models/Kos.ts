import {
  ConceptSchemesQuery,
  ConceptsQuery,
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  Identifier,
  StubSequence,
  UnbatchedStubSequence,
  abc,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { getRdfInstances } from "@kos-kit/rdf-utils";
import TermSet from "@rdfjs/term-set";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { limitGenerator } from "./limitGenerator.js";
import { offsetGenerator } from "./offsetGenerator.js";

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
  readonly dataset: DatasetCore;

  constructor({ dataset, ...otherParameters }: Kos.Parameters) {
    super(otherParameters);
    this.dataset = dataset;
  }

  async conceptSchemes({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptSchemesQuery;
  }): Promise<StubSequence<ConceptSchemeT>> {
    return new UnbatchedStubSequence([
      ...limitGenerator(
        offsetGenerator(this.queryConceptSchemes(query), offset),
        limit,
      ),
    ]);
  }

  override async conceptSchemesCount(
    query: ConceptSchemesQuery,
  ): Promise<number> {
    return this.queryConceptSchemes(query).count();
  }

  async concepts({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptsQuery;
  }): Promise<StubSequence<ConceptT>> {
    return new UnbatchedStubSequence([
      ...limitGenerator(
        offsetGenerator(this.queryConcepts(query), offset),
        limit,
      ),
    ]);
  }

  override async conceptsCount(query: ConceptsQuery): Promise<number> {
    return this.queryConcepts(query).count();
  }

  private *allConceptSchemes(): Generator<
    abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>
  > {
    for (const identifier of getRdfInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
    })) {
      if (identifier.termType === "NamedNode") {
        yield this.conceptScheme(identifier);
      }
    }
  }

  private *queryConceptSchemes(
    query: ConceptSchemesQuery,
  ): Generator<abc.ConceptSchemeStub<ConceptT, ConceptSchemeT, LabelT>> {
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

  private *queryConcepts(
    query: ConceptsQuery,
  ): Generator<abc.ConceptStub<ConceptT, ConceptSchemeT, LabelT>> {
    if (query.type === "All") {
      for (const identifier of getRdfInstances({
        class_: skos.Concept,
        dataset: this.dataset,
      })) {
        if (identifier.termType === "NamedNode") {
          yield this.concept(identifier);
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
        query.semanticRelationProperty.identifier,
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
        query.semanticRelationProperty.identifier,
        query.objectConceptIdentifier,
      )) {
        // The semantic relation properties have a domain of skos:Concept
        if (quad.subject.termType === "NamedNode") {
          yield this.concept(quad.subject);
        }
      }
      return;
    }

    throw new RangeError();
  }
}

export namespace Kos {
  export interface Parameters extends abc.Kos.Parameters {
    dataset: DatasetCore;
  }
}
