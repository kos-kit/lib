import { skosxl } from "../../vocabularies";
import { Label } from "../Label";
import { LabeledModel as ILabeledModel } from "../LabeledModel";
import { LanguageTag } from "../LanguageTag";
import { LabeledModel as RdfJsLabeledModel } from "../mem/LabeledModel";
import { Model } from "./Model";

export abstract class LabeledModel<RdfJsModelT extends RdfJsLabeledModel>
  extends Model<RdfJsModelT>
  implements ILabeledModel
{
  get altLabels(): readonly Label[] {
    return (await this.getOrCreateRdfJsModel()).altLabels;
  }

  async hiddenLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
  }): Promise<readonly Label[]> {
    return (await this.getOrCreateRdfJsModel()).altLabels(kwds);
  }

  async displayLabel(languageTag: string): Promise<string> {
    return (await this.getOrCreateRdfJsModel()).displayLabel(languageTag);
  }

  async prefLabels(kwds?: {
    languageTags?: Set<LanguageTag>;
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
