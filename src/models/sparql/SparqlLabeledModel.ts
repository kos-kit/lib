import { skosxl } from "../../vocabularies";
import { Label } from "../Label";
import { LabeledModel } from "../LabeledModel";
import { LanguageTag } from "../LanguageTag";
import { RdfJsLabeledModel } from "../rdfjs/RdfJsLabeledModel";
import { SparqlModel } from "./SparqlModel";

export abstract class SparqlLabeledModel<RdfJsModelT extends RdfJsLabeledModel>
  extends SparqlModel<RdfJsModelT>
  implements LabeledModel
{
  async altLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(kwds);
  }

  async hiddenLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(kwds);
  }

  async prefLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).prefLabels(kwds);
  }

  protected override get rdfJsDatasetQueryString(): string {
    return `
CONSTRUCT {
  <${this.identifier.value}> ?p ?o .
  <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm .
} WHERE {  
  { <${this.identifier.value}> ?p ?o . }
  UNION
  { <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm . }
}
`;
  }
}
