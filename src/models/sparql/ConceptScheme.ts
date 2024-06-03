import { ConceptScheme as IConceptScheme } from "../ConceptScheme";
import { ConceptScheme as MemConceptScheme } from "../mem/ConceptScheme";
import { LabeledModel as LabeledModel } from "./LabeledModel";
import { Concept } from "./Concept";
import { identifierToString } from "../../utilities";
import { skos } from "../../vocabularies";
import { Identifier } from "../Identifier";
import { mapResultRowsToIdentifiers } from "./mapResultRowsToIdentifiers";
import { mapResultRowsToCount } from "./mapResultRowsToCount";

export class ConceptScheme
  extends LabeledModel<MemConceptScheme>
  implements IConceptScheme
{
  async topConceptsCount(): Promise<number> {
    const identifierString = identifierToString(this.identifier);
    return mapResultRowsToCount(
      await this.sparqlClient.query.select(`\
SELECT (COUNT(DISTINCT ?concept) AS ?count)
WHERE {
  { ${identifierString} <${skos.hasTopConcept.value}> ?concept . }
  UNION
  { ?concept <${skos.topConceptOf.value}> ${identifierString} . }
}`),
      "count",
    );
  }

  private async topConceptIdentifiersPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Identifier[]> {
    const identifierString = identifierToString(this.identifier);
    return mapResultRowsToIdentifiers(
      await this.sparqlClient.query.select(`\
SELECT DISTINCT ?concept
WHERE {
  { ${identifierString} <${skos.hasTopConcept.value}> ?concept . }
  UNION
  { ?concept <${skos.topConceptOf.value}> ${identifierString} . }
}
LIMIT ${limit}
OFFSET ${offset}`),
      "concept",
    );
  }

  async topConceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return this.kos.conceptsByIdentifiers(
      await this.topConceptIdentifiersPage({ limit, offset }),
    );
  }
}
