import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Identifier,
  Label,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";
import { ModelFetcher } from "./ModelFetcher.js";
import { SparqlClient } from "./SparqlClient.js";
import { Maybe } from "purify-ts";

/**
 * The SPARQL-backed models are implemented in the spirit of Labeled Property Graphs:
 * - "properties" such as labels (skos:prefLabel, et al.), rights, et al. should be available as instance members in memory / without asynchronous calls.
 * - "relationships" such as broader concepts, in-concept scheme, et al. should be retrieved via asynchronous calls.
 *
 * That means that creating a new instance of a model, such as a Concept, entails retrieving all of its instance "properties" first, usually via a SPARQL CONSTRUCT query.
 *
 * The line between "properties" and "relationships" can be intentionally blurred. For example:
 * - Not all literals attached to an instance have to be "properties". Literals that would take up significant space (long strings, large arrays, etc.) can be retrieved via asynchronous methods instead.
 * - Related RDF resources such as skosxl:Label instances can be retrieved as "properties".
 */
export class Concept<
  MemConceptT extends IConcept,
  SparqlConceptT extends IConcept,
  SparqlConceptSchemeT extends IConceptScheme,
> implements IConcept
{
  protected readonly memModel: MemConceptT;
  protected readonly modelFetcher: ModelFetcher<
    SparqlConceptT,
    SparqlConceptSchemeT
  >;
  protected readonly sparqlClient: SparqlClient;

  constructor({
    memModel,
    modelFetcher,
    sparqlClient,
  }: Concept.Parameters<MemConceptT, SparqlConceptT, SparqlConceptSchemeT>) {
    this.memModel = memModel;
    this.modelFetcher = modelFetcher;
    this.sparqlClient = sparqlClient;
  }

  get altLabels(): readonly Label[] {
    return this.memModel.altLabels;
  }

  get displayLabel(): string {
    return this.memModel.displayLabel;
  }

  equals(other: IConcept): boolean {
    return IConcept.equals(this, other);
  }

  get hiddenLabels(): readonly Label[] {
    return this.memModel.hiddenLabels;
  }

  get identifier(): Identifier {
    return this.memModel.identifier;
  }

  async inSchemes(): Promise<
    readonly ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT>[]
  > {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    const identifierString = Resource.Identifier.toString(this.identifier);
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`
SELECT DISTINCT ?conceptScheme
WHERE {
  { ${identifierString} <${skos.inScheme.value}> ?conceptScheme . }
  UNION
  { ${identifierString} <${skos.topConceptOf.value}> ?conceptScheme . }
  UNION
  { ?conceptScheme <${skos.hasTopConcept.value}> ${identifierString} . }
}`),
      "conceptScheme",
    ).map(
      (identifier) =>
        new ConceptSchemeStub({
          identifier,
          modelFetcher: this.modelFetcher,
        }),
    );
  }

  get license(): Maybe<Literal | NamedNode> {
    return this.memModel.license;
  }

  get modified(): Maybe<Literal> {
    return this.memModel.modified;
  }

  get notations(): readonly Literal[] {
    return this.memModel.notations;
  }

  notes(property: NoteProperty): readonly Literal[] {
    return this.memModel.notes(property);
  }

  get prefLabels(): readonly Label[] {
    return this.memModel.prefLabels;
  }

  get rights(): Maybe<Literal> {
    return this.memModel.rights;
  }

  get rightsHolder(): Maybe<Literal> {
    return this.memModel.rightsHolder;
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly ConceptStub<SparqlConceptT, SparqlConceptSchemeT>[]> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`
SELECT DISTINCT ?concept
WHERE {
  ${Resource.Identifier.toString(this.identifier)} <${property.identifier.value}> ?concept .
}`),
      "concept",
    ).map(
      (identifier) =>
        new ConceptStub({ identifier, modelFetcher: this.modelFetcher }),
    );
  }

  async semanticRelationsCount(
    property: SemanticRelationProperty,
  ): Promise<number> {
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
${Resource.Identifier.toString(this.identifier)} <${property.identifier.value}> ?concept .
}`),
      "count",
    );
  }

  async topConceptOf(): Promise<
    readonly ConceptSchemeStub<SparqlConceptT, SparqlConceptSchemeT>[]
  > {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`
SELECT DISTINCT ?conceptScheme
WHERE {
  { ?conceptScheme <${skos.hasTopConcept.value}> ${identifierString} . }
  UNION
  { ${identifierString} <${skos.topConceptOf.value}> ?conceptScheme . }
}`),
      "conceptScheme",
    ).map(
      (identifier) =>
        new ConceptSchemeStub({ identifier, modelFetcher: this.modelFetcher }),
    );
  }
}

export namespace Concept {
  export interface Parameters<
    MemConceptT extends IConcept,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  > {
    memModel: MemConceptT;
    modelFetcher: ModelFetcher<SparqlConceptT, SparqlConceptSchemeT>;
    sparqlClient: SparqlClient;
  }
}
