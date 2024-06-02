import { ConceptScheme as IConceptScheme } from "../ConceptScheme";
import { ConceptScheme as RdfJsConceptScheme } from "../mem/ConceptScheme";
import { LabeledModel as LabeledModel } from "./LabeledModel";
import { Concept } from "./Concept";

export class ConceptScheme
  extends LabeledModel<RdfJsConceptScheme>
  implements IConceptScheme
{
  // protected createRdfJsModel(
  //   dataset: DatasetCore<Quad, Quad>,
  // ): RdfJsConceptScheme {
  //   return new RdfJsConceptScheme({ dataset, identifier: this.identifier });
  // }

  //   protected override get rdfJsDatasetQueryString(): string {
  //     return `
  // CONSTRUCT {
  //   <${this.identifier.value}> ?p ?o .
  //   <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm .
  //   ?concept <${skos.topConceptOf.value}> <${this.identifier.value}> .
  // } WHERE {
  //   { <${this.identifier.value}> ?p ?o . }
  //   UNION
  //   { <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm . }
  //   UNION
  //   { ?concept <${skos.topConceptOf.value}> <${this.identifier.value}> . }
  // }
  // `;
  //   }

  async topConcepts(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    throw new Error("not implemented yet");
    // return (await (await this.getOrCreateRdfJsModel()).topConcepts(kwds)).map(
    //   (conceptScheme) =>
    //     new Concept({
    //       identifier: conceptScheme.identifier,
    //       sparqlClient: this.sparqlClient,
    //     }),
    // );
  }

  async topConceptsCount(): Promise<number> {
    throw new Error("not implemented yet");
    // return (await this.getOrCreateRdfJsModel()).topConceptsCount();
  }
}
