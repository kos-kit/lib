import TermSet from "@rdfjs/term-set";
import { DatasetCore } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Either } from "purify-ts";
import { Resource, ResourceSet } from "rdfjs-resource";
import { ModelFactories } from "./ModelFactories.js";
import {
  Concept,
  ConceptQuery,
  ConceptScheme,
  ConceptSchemeQuery,
  ConceptSchemeStub,
  ConceptStub,
  Identifier,
  Kos,
  LanguageTag,
  SemanticRelationProperty,
} from "./index.js";

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

function sortIdentifiers(
  identifiers: readonly Identifier[],
): readonly Identifier[] {
  const sortedIdentifiers = identifiers.concat();
  sortedIdentifiers.sort((left, right) =>
    left.value.localeCompare(right.value),
  );
  return sortedIdentifiers;
}

export class RdfjsDatasetKos<
  ConceptT extends Concept = Concept,
  ConceptSchemeT extends ConceptScheme = ConceptScheme,
  ConceptSchemeStubT extends ConceptSchemeStub = ConceptSchemeStub,
  ConceptStubT extends ConceptStub = ConceptStub,
> implements Kos<ConceptT, ConceptSchemeT, ConceptSchemeStubT, ConceptStubT>
{
  readonly resourceSet: ResourceSet;
  protected readonly languageIn: readonly LanguageTag[];
  private readonly modelFactories: ModelFactories<
    ConceptT,
    ConceptSchemeT,
    ConceptSchemeStubT,
    ConceptStubT
  >;

  constructor({
    dataset,
    languageIn,
    modelFactories,
  }: {
    dataset: DatasetCore;
    languageIn: readonly LanguageTag[];
    modelFactories: ModelFactories<
      ConceptT,
      ConceptSchemeT,
      ConceptSchemeStubT,
      ConceptStubT
    >;
  }) {
    this.languageIn = languageIn;
    this.modelFactories = modelFactories;
    this.resourceSet = new ResourceSet({ dataset });
  }

  get dataset(): DatasetCore {
    return this.resourceSet.dataset;
  }

  async concept(identifier: Identifier): Promise<Either<Error, ConceptT>> {
    return this.conceptSync(identifier);
  }

  async conceptIdentifiers(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<Either<Error, readonly Identifier[]>> {
    return Either.of(this.conceptIdentifiersSync(parameters));
  }

  conceptIdentifiersSync({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): readonly Identifier[] {
    return sortIdentifiers([...this.queryConcepts(query)]).slice(
      offset,
      limit !== null ? offset + limit : undefined,
    );
  }

  async concepts(
    identifiers: readonly Identifier[],
  ): Promise<readonly Either<Error, ConceptT>[]> {
    return this.conceptsSync(identifiers);
  }

  conceptsSync(
    identifiers: readonly Identifier[],
  ): readonly Either<Error, ConceptT>[] {
    return identifiers.map((identifier) => this.conceptSync(identifier));
  }

  async conceptScheme(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeT>> {
    return this.conceptSchemeSync(identifier);
  }

  async conceptSchemeIdentifiers(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<Either<Error, readonly Identifier[]>> {
    return Either.of(this.conceptSchemeIdentifiersSync(parameters));
  }

  conceptSchemeIdentifiersSync({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): readonly Identifier[] {
    return sortIdentifiers([...this.queryConceptSchemes(query)]).slice(
      offset,
      limit !== null ? offset + limit : undefined,
    );
  }

  async conceptSchemeStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptSchemeStubT>> {
    return this.conceptSchemeStubSync(identifier);
  }

  conceptSchemeStubSync(
    identifier: Identifier,
  ): Either<Error, ConceptSchemeStubT> {
    return this.modelFactories.conceptSchemeStub.fromRdf({
      languageIn: this.languageIn,
      resource: this.resourceSet.namedResource(identifier),
    });
  }

  async conceptSchemeStubs(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): Promise<Either<Error, readonly ConceptSchemeStubT[]>> {
    return Either.of(this.conceptSchemeStubsSync(parameters));
  }

  conceptSchemeStubsSync({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptSchemeQuery;
  }): readonly ConceptSchemeStubT[] {
    const conceptSchemeStubs: ConceptSchemeStubT[] = [];
    let conceptSchemeI = 0;
    for (const conceptSchemeIdentifier of this.queryConceptSchemes(query)) {
      this.modelFactories.conceptSchemeStub
        .fromRdf({
          languageIn: this.languageIn,
          resource: this.resourceSet.namedResource(conceptSchemeIdentifier),
        })
        .ifRight((conceptSchemeStub) => {
          if (conceptSchemeI++ >= offset) {
            conceptSchemeStubs.push(conceptSchemeStub);
          }
        });
      if (limit !== null && conceptSchemeStubs.length === limit) {
        break;
      }
    }
    return conceptSchemeStubs;
  }

  conceptSchemeSync(identifier: Identifier): Either<Error, ConceptSchemeT> {
    return this.modelFactories.conceptScheme.fromRdf({
      languageIn: this.languageIn,
      resource: this.resourceSet.namedResource(identifier),
    });
  }

  async conceptSchemesCount(
    query: ConceptSchemeQuery,
  ): Promise<Either<Error, number>> {
    return Either.of(this.conceptSchemesCountSync(query));
  }

  conceptSchemesCountSync(query: ConceptSchemeQuery): number {
    let count = 0;
    for (const _ of this.queryConceptSchemes(query)) {
      count++;
    }
    return count;
  }

  async conceptStub(
    identifier: Identifier,
  ): Promise<Either<Error, ConceptStubT>> {
    return this.conceptStubSync(identifier);
  }

  conceptStubSync(identifier: Identifier): Either<Error, ConceptStubT> {
    return this.modelFactories.conceptStub.fromRdf({
      languageIn: this.languageIn,
      resource: this.resourceSet.namedResource(identifier),
    });
  }

  async conceptStubs(parameters: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): Promise<Either<Error, readonly ConceptStubT[]>> {
    return Either.of(this.conceptStubsSync(parameters));
  }

  conceptStubsSync({
    limit,
    offset,
    query,
  }: {
    limit: number | null;
    offset: number;
    query: ConceptQuery;
  }): readonly ConceptStubT[] {
    const conceptStubs: ConceptStubT[] = [];
    let conceptI = 0;
    for (const conceptIdentifier of this.queryConcepts(query)) {
      this.modelFactories.conceptStub
        .fromRdf({
          languageIn: this.languageIn,
          resource: this.resourceSet.namedResource(conceptIdentifier),
        })
        .ifRight((conceptStub) => {
          if (conceptI++ >= offset) {
            conceptStubs.push(conceptStub);
          }
        });
      if (limit !== null && conceptStubs.length === limit) {
        break;
      }
    }
    return conceptStubs;
  }

  conceptSync(identifier: Identifier): Either<Error, ConceptT> {
    return this.modelFactories.concept.fromRdf({
      languageIn: this.languageIn,
      resource: this.resourceSet.namedResource(identifier),
    });
  }

  async conceptsCount(query: ConceptQuery): Promise<Either<Error, number>> {
    return Either.of(this.conceptsCountSync(query));
  }

  conceptsCountSync(query: ConceptQuery): number {
    let count = 0;
    for (const _ of this.queryConcepts(query)) {
      count++;
    }
    return count;
  }

  private *queryConceptSchemes(
    query: ConceptSchemeQuery,
  ): Generator<Identifier> {
    if (query.type === "All") {
      for (const resource of this.resourceSet.namedInstancesOf(
        skos.ConceptScheme,
      )) {
        yield resource.identifier;
      }
      return;
    }

    for (const conceptSchemeIdentifier of this.queryConceptSchemes({
      type: "All",
    })) {
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

      yield conceptSchemeIdentifier;
    }
  }

  private *querySemanticallyRelatedConcepts({
    objectConceptIdentifier,
    subjectConceptIdentifier,
    semanticRelationProperties,
    yieldedConceptIdentifiers,
  }: {
    objectConceptIdentifier?: Identifier;
    semanticRelationProperties: readonly SemanticRelationProperty[];
    subjectConceptIdentifier?: Identifier;
    yieldedConceptIdentifiers: TermSet<Identifier>;
  }): Generator<Identifier> {
    for (const semanticRelationProperty of semanticRelationProperties) {
      for (const quad of this.dataset.match(
        subjectConceptIdentifier,
        semanticRelationProperty.identifier,
        objectConceptIdentifier,
      )) {
        // The semantic relation properties have a range of skos:Concept
        const semanticallyRelatedConceptIdentifier = subjectConceptIdentifier
          ? quad.object
          : quad.subject;
        if (
          semanticallyRelatedConceptIdentifier.termType === "NamedNode" &&
          !yieldedConceptIdentifiers.has(semanticallyRelatedConceptIdentifier)
        ) {
          yield semanticallyRelatedConceptIdentifier;
          yieldedConceptIdentifiers.add(semanticallyRelatedConceptIdentifier);
        }
      }
    }
  }

  private *queryConcepts(query: ConceptQuery): Generator<Identifier> {
    if (query.type === "All") {
      for (const resource of this.resourceSet.namedInstancesOf(skos.Concept)) {
        yield resource.identifier;
      }
      return;
    }

    if (query.type === "Identifiers") {
      for (const identifier of query.conceptIdentifiers) {
        if (
          this.resourceSet.namedResource(identifier).isInstanceOf(skos.Concept)
        ) {
          yield identifier;
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
        yield query.conceptIdentifier;
        return;
      }
      return;
    }

    const yieldedConceptIdentifiers = new TermSet<Identifier>();

    if (query.type === "InScheme" || query.type === "TopConceptOf") {
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
          yield quad.object;
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
          yield quad.subject;
          yieldedConceptIdentifiers.add(quad.subject);
        }
      }

      if (query.type === "InScheme") {
        for (const quad of this.dataset.match(
          null,
          skos.inScheme,
          query.conceptSchemeIdentifier,
        )) {
          if (
            quad.subject.termType !== "NamedNode" ||
            yieldedConceptIdentifiers.has(quad.subject)
          ) {
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
          yield quad.subject;
          yieldedConceptIdentifiers.add(quad.subject);
        }
      }

      return;
    }

    if (query.type === "ObjectsOfSemanticRelations") {
      yield* this.querySemanticallyRelatedConcepts({
        semanticRelationProperties: query.semanticRelationProperties,
        subjectConceptIdentifier: query.subjectConceptIdentifier,
        yieldedConceptIdentifiers,
      });

      if (query.inverseSemanticRelationProperties) {
        yield* this.querySemanticallyRelatedConcepts({
          objectConceptIdentifier: query.subjectConceptIdentifier,
          semanticRelationProperties: query.semanticRelationProperties.flatMap(
            (semanticRelationProperty) =>
              semanticRelationProperty.inverse.toList(),
          ),
          yieldedConceptIdentifiers,
        });
      }

      return;
    }

    if (query.type === "SubjectsOfSemanticRelations") {
      yield* this.querySemanticallyRelatedConcepts({
        objectConceptIdentifier: query.objectConceptIdentifier,
        semanticRelationProperties: query.semanticRelationProperties,
        yieldedConceptIdentifiers,
      });

      if (query.inverseSemanticRelationProperties) {
        yield* this.querySemanticallyRelatedConcepts({
          semanticRelationProperties: query.semanticRelationProperties.flatMap(
            (semanticRelationProperty) =>
              semanticRelationProperty.inverse.toList(),
          ),
          subjectConceptIdentifier: query.objectConceptIdentifier,
          yieldedConceptIdentifiers,
        });
      }

      return;
    }

    throw new RangeError("should never reach this code");
  }
}
