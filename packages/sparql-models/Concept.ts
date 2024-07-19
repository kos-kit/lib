import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  NoteProperty,
  SemanticRelationProperty,
  StubArray,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";
import { mapResultRowsToCount } from "./mapResultRowsToCount.js";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers.js";
import { ConceptSchemeStub } from "./ConceptSchemeStub.js";
import { ConceptStub } from "./ConceptStub.js";

export class Concept<
    MemConceptT extends IConcept,
    SparqlConceptT extends IConcept,
    SparqlConceptSchemeT extends IConceptScheme,
  >
  extends LabeledModel<MemConceptT, SparqlConceptT, SparqlConceptSchemeT>
  implements IConcept
{
  get notations(): readonly Literal[] {
    return this.memModel.notations;
  }

  async inSchemes(): Promise<StubArray<SparqlConceptSchemeT>> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    const identifierString = Resource.Identifier.toString(this.identifier);
    return new StubArray(
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
      ).map(
        (identifier) =>
          new ConceptSchemeStub({
            identifier,
            modelFetcher: this.modelFetcher,
          }),
      ),
    );
  }

  notes(property: NoteProperty): readonly Literal[] {
    return this.memModel.notes(property);
  }

  async semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<StubArray<SparqlConceptT>> {
    // Could do this in a single CONSTRUCT as an optimization. This code is simpler.
    return new StubArray(
      mapResultRowsToIdentifiers(
        await this.sparqlClient.query.select(`
SELECT DISTINCT ?concept
WHERE {
  ${Resource.Identifier.toString(this.identifier)} <${property.identifier.value}> ?concept .
}`),
        "concept",
      ).map(
        (identifier) =>
          new ConceptStub({ identifier, modelFetcher: this.modelFetcher }),
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

  async topConceptOf(): Promise<StubArray<SparqlConceptSchemeT>> {
    const identifierString = Resource.Identifier.toString(this.identifier);
    return new StubArray(
      mapResultRowsToIdentifiers(
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
          new ConceptSchemeStub({
            identifier,
            modelFetcher: this.modelFetcher,
          }),
      ),
    );
  }
}
