import { LabeledModel as ILabeledModel, Label } from "@kos-kit/models";
import { LabeledModel as MemLabeledModel } from "@kos-kit/mem-models";
import {
  GraphPattern,
  GraphPatternSubject,
  GraphPatternVariable,
} from "./GraphPattern.js";
import { Model } from "./Model.js";
import { skos, skosxl } from "@tpluscode/rdf-ns-builders";

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

  static override propertyGraphPatterns({
    subject,
    variablePrefix,
  }: {
    subject: GraphPatternSubject;
    variablePrefix: string;
  }): readonly GraphPattern[] {
    const graphPatterns: GraphPattern[] = [];
    for (const { skosPredicate, skosxlPredicate, variableName } of [
      {
        skosPredicate: skos.altLabel,
        skosxlPredicate: skosxl.altLabel,
        variableName: "AltLabel",
      },
      {
        skosPredicate: skos.hiddenLabel,
        skosxlPredicate: skosxl.hiddenLabel,
        variableName: "HiddenLabel",
      },
      {
        skosPredicate: skos.prefLabel,
        skosxlPredicate: skosxl.prefLabel,
        variableName: "PrefLabel",
      },
    ]) {
      graphPatterns.push({
        subject,
        predicate: skosPredicate,
        object: {
          plainLiteral: true,
          termType: "Variable",
          value: variablePrefix + variableName,
        },
        optional: true,
      });

      const skosxlLabelVariable: GraphPatternVariable = {
        termType: "Variable",
        value: variablePrefix + variableName + "Resource",
      };
      graphPatterns.push({
        subject,
        predicate: skosxlPredicate,
        object: skosxlLabelVariable,
        optional: true,
        subGraphPatterns: Model.propertyGraphPatterns({
          subject: skosxlLabelVariable,
          variablePrefix: skosxlLabelVariable.value,
        }).concat([
          {
            subject: skosxlLabelVariable,
            predicate: skosxl.literalForm,
            object: {
              termType: "Variable",
              value: variablePrefix + variableName + "LiteralForm",
            },
            optional: false,
          },
        ]),
      });
    }

    return Model.propertyGraphPatterns({ subject, variablePrefix }).concat(
      graphPatterns,
    );
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
