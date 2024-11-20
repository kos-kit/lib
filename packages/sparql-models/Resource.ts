import { Label } from "@kos-kit/models";
import { GraphPattern, ResourceGraphPatterns } from "@kos-kit/sparql-builder";
import { skosxl } from "@tpluscode/rdf-ns-builders";
import { Model } from "./Model.js";

export namespace Resource {
  export class GraphPatterns extends Model.GraphPatterns {
    constructor(subject: ResourceGraphPatterns.SubjectParameter) {
      super(subject);

      for (let labelTypeI = 0; labelTypeI < Label.Types.length; labelTypeI++) {
        const labelType = Label.Types[labelTypeI];
        this.add(
          GraphPattern.optional(
            GraphPattern.basic(this.subject, labelType.literalProperty, {
              ...this.variable(`LabelType${labelTypeI}Literal`),
              plainLiteral: true,
            }),
          ),
        );

        const skosXlProperty = labelType.skosXlProperty.extractNullable();
        if (skosXlProperty !== null) {
          const skosXlLabelVariable = this.variable(
            `LabelType${labelTypeI}Resource`,
          );
          this.add(
            GraphPattern.optional(
              GraphPattern.group([
                GraphPattern.basic(
                  this.subject,
                  skosXlProperty,
                  skosXlLabelVariable,
                ),
                ...new Model.GraphPatterns(skosXlLabelVariable),
                GraphPattern.basic(
                  skosXlLabelVariable,
                  skosxl.literalForm,
                  GraphPattern.variable(
                    `${skosXlLabelVariable.value}LiteralForm`,
                  ),
                ),
              ]),
            ),
          );
        }
      }
    }
  }
}
