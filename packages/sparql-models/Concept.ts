import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  NoteProperty,
  SemanticRelationProperty,
  noteProperties,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { GraphPattern, GraphPatternSubject } from "./GraphPattern.js";
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
    return this.modelFetcher.fetchConceptSchemesByIdentifiers(
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
    );
  }

  get notations(): readonly Literal[] {
    return this.memModel.notations;
  }

  notes(property: NoteProperty): readonly Literal[] {
    return this.memModel.notes(property);
  }

  static override propertyGraphPatterns({
    subject,
    variablePrefix,
  }: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    const graphPatterns: GraphPattern[] = [];

    graphPatterns.push({
      subject,
      predicate: skos.notation,
      object: {
        termType: "Variable",
        value: variablePrefix + "Notation",
      },
      optional: true,
    });

    for (const noteProperty of noteProperties) {
      graphPatterns.push({
        subject,
        predicate: noteProperty.identifier,
        object: {
          plainLiteral: true,
          termType: "Variable",
          value:
            variablePrefix +
            noteProperty.name[0].toUpperCase() +
            noteProperty.name.substring(1),
        },
        optional: true,
      });
    }

    return LabeledModel.propertyGraphPatterns({
      subject,
      variablePrefix,
    }).concat(graphPatterns);
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly SparqlConceptT[]> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    return this.modelFetcher.fetchConceptsByIdentifiers(
      mapResultRowsToIdentifiers(
        await this.sparqlClient.query.select(`
SELECT DISTINCT ?concept
WHERE {
  ${Resource.Identifier.toString(this.identifier)} <${property.identifier.value}> ?concept .
}`),
        "concept",
      ),
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

  async topConceptOf(): Promise<readonly SparqlConceptSchemeT[]> {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return this.modelFetcher.fetchConceptSchemesByIdentifiers(
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
    );
  }
}
