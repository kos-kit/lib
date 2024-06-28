import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { LabeledModel } from "./LabeledModel.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";

export class Concept<
    MemConceptT extends IConcept,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends LabeledModel<MemConceptT, SparqlConceptT, SparqlConceptSchemeT>
  implements IConcept
{
  async inSchemes(): Promise<readonly SparqlConceptSchemeT[]> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    const identifierString = Resource.Identifier.toString(this.identifier);
    return (
      await this.modelFetcher.fetchConceptSchemesByIdentifiers(
        mapResultRowsToIdentifiers(
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
        ),
      )
    ).flatMap((concept) => (O.isSome(concept) ? [concept.value] : []));
  }

  get notations(): readonly Literal[] {
    return this.memModel.notations;
  }

  notes(property: NoteProperty): readonly Literal[] {
    return this.memModel.notes(property);
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly SparqlConceptT[]> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    return (
      await this.modelFetcher.fetchConceptsByIdentifiers(
        mapResultRowsToIdentifiers(
          await this.sparqlClient.query.select(`
SELECT DISTINCT ?concept
WHERE {
  ${Resource.Identifier.toString(this.identifier)} <${property.identifier.value}> ?concept .
}`),
          "concept",
        ),
      )
    ).flatMap((concept) => (O.isSome(concept) ? [concept.value] : []));
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

  async topConceptOf(): Promise<readonly SparqlConceptSchemeT[]> {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return (
      await this.modelFetcher.fetchConceptSchemesByIdentifiers(
        mapResultRowsToIdentifiers(
          await this.sparqlClient.query.select(`
SELECT DISTINCT ?conceptScheme
WHERE {
  { ?conceptScheme <${skos.hasTopConcept.value}> ${identifierString} . }
  UNION
  { ${identifierString} <${skos.topConceptOf.value}> ?conceptScheme . }
}`),
          "conceptScheme",
        ),
      )
    ).flatMap((concept) => (O.isSome(concept) ? [concept.value] : []));
  }
}
