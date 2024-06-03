import { LabeledModel } from "./LabeledModel";
import { Concept as MemConcept } from "../mem/Concept";
import { Concept as IConcept } from "../Concept";
import { ConceptScheme } from "./ConceptScheme";
import { NoteProperty } from "../NoteProperty";
import { SemanticRelationProperty } from "../SemanticRelationProperty";
import { Literal } from "@rdfjs/types";
import { GraphPatternSubject, GraphPattern } from "./GraphPattern";
import { noteProperties } from "../noteProperties";
import { skos } from "../../vocabularies";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers";
import { identifierToString } from "../../utilities";
import { mapResultRowsToCount } from "./mapResultRowsToCount";

export class Concept extends LabeledModel<MemConcept> implements IConcept {
  async inSchemes(): Promise<readonly ConceptScheme[]> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    const identifierString = identifierToString(this.identifier);
    return this.kos.conceptSchemesByIdentifiers(
      mapResultRowsToIdentifiers(
        await this.sparqlClient.query.select(`
SELECT DISTINCT ?conceptScheme
WHERE {
  { ${identifierString} <${skos.inScheme.value}> ?conceptScheme . }
  UNION
  { ${identifierString} <${skos.topConceptOf.value}> ?conceptScheme . }
  UNION
  { ?conceptScheme <${skos.hasTopConcept.value} ${identifierString} . }
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
        value: "notation",
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
          value: noteProperty.name,
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
  ): Promise<readonly Concept[]> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    return this.kos.conceptsByIdentifiers(
      mapResultRowsToIdentifiers(
        await this.sparqlClient.query.select(`
SELECT DISTINCT ?concept
WHERE {
  ${identifierToString(this.identifier)} <${property.identifier}> ?concept .
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
SELECT COUNT(DISTINCT ?concept) AS ?count
WHERE {
${identifierToString(this.identifier)} <${property.identifier}> ?concept .
}`),
      "count",
    );
  }

  async topConceptOf(): Promise<readonly ConceptScheme[]> {
    const identifierString = identifierToString(this.identifier);
    return this.kos.conceptSchemesByIdentifiers(
      mapResultRowsToIdentifiers(
        await this.sparqlClient.query.select(`
SELECT DISTINCT ?conceptScheme
WHERE {
  { ?conceptScheme <${skos.hasTopConcept}> ${identifierString} . }
  UNION
  { ${identifierString} <${skos.topConceptOf}> ?conceptScheme . }
}`),
        "conceptScheme",
      ),
    );
  }
}
