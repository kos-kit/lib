import { Label } from "../Label";
import { LabeledModel as ILabeledModel } from "../LabeledModel";
import { LabeledModel as MemLabeledModel } from "../mem/LabeledModel";
import {
  GraphPattern,
  GraphPatternSubject,
  GraphPatternVariable,
} from "./GraphPattern";
import { Model } from "./Model";
import { skos, skosxl } from "../../vocabularies";

export abstract class LabeledModel<MemModelT extends MemLabeledModel>
  extends Model<MemModelT>
  implements ILabeledModel
{
  get altLabels(): readonly Label[] {
    return this.memModel.altLabels;
  }

  get displayLabel(): string {
    return this.memModel.displayLabel;
  }

  get hiddenLabels(): readonly Label[] {
    return this.memModel.hiddenLabels;
  }

  get prefLabels(): readonly Label[] {
    return this.memModel.prefLabels;
  }

  static override propertyGraphPatterns(
    subject: GraphPatternSubject,
  ): readonly GraphPattern[] {
    const graphPatterns: GraphPattern[] = [];
    for (const { skosPredicate, skosxlPredicate, variableName } of [
      {
        skosPredicate: skos.altLabel,
        skosxlPredicate: skosxl.altLabel,
        variableName: "altLabel",
      },
      {
        skosPredicate: skos.hiddenLabel,
        skosxlPredicate: skosxl.hiddenLabel,
        variableName: "hiddenLabel",
      },
      {
        skosPredicate: skos.prefLabel,
        skosxlPredicate: skosxl.prefLabel,
        variableName: "prefLabel",
      },
    ]) {
      graphPatterns.push({
        subject,
        predicate: skosPredicate,
        object: {
          plainLiteral: true,
          termType: "Variable",
          value: variableName,
        },
        optional: true,
      });

      const skosxlLabelVariable: GraphPatternVariable = {
        termType: "Variable",
        value: variableName + "Resource",
      };
      graphPatterns.push({
        subject,
        predicate: skosxlPredicate,
        object: skosxlLabelVariable,
        optional: true,
        subGraphPatterns: Model.propertyGraphPatterns(
          skosxlLabelVariable,
        ).concat([
          {
            subject: skosxlLabelVariable,
            predicate: skosxl.literalForm,
            object: {
              termType: "Variable",
              value: variableName + "LiteralForm",
            },
            optional: false,
          },
        ]),
      });
    }

    return Model.propertyGraphPatterns(subject).concat(graphPatterns);
  }

  //   protected override get rdfJsDatasetQueryString(): string {
  //     return `
  // CONSTRUCT {
  //   <${this.identifier.value}> ?p ?o .
  //   <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm .
  // } WHERE {
  //   { <${this.identifier.value}> ?p ?o . }
  //   UNION
  //   { <${this.identifier.value}> ?p ?label . ?label <${skosxl.literalForm.value}> ?literalForm . }
  // }
  // `;
  //   }
}
