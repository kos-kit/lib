import { Label } from "@kos-kit/models";
import { skosxl } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { Model } from "./Model.js";
import { ResourceGraphPatterns } from "./ResourceGraphPatterns.js";

export namespace LabeledModel {
  export class GraphPatterns extends ResourceGraphPatterns {
    override *[Symbol.iterator](): Iterator<GraphPattern> {
      yield* new Model.GraphPatterns(this.subject);

      for (let labelTypeI = 0; labelTypeI < Label.Types.length; labelTypeI++) {
        const labelType = Label.Types[labelTypeI];
        yield GraphPattern.optional(
          GraphPattern.basic(this.subject, labelType.literalProperty, {
            ...this.variable(`LabelType${labelTypeI}Literal`),
            plainLiteral: true,
          }),
        );

        const skosXlProperty = labelType.skosXlProperty.extractNullable();
        if (skosXlProperty !== null) {
          const skosXlLabelVariable: BasicGraphPattern.Variable = this.variable(
            `LabelType${labelTypeI}Resource`,
          );
          yield GraphPattern.optional(
            GraphPattern.group(
              GraphPattern.basic(
                this.subject,
                skosXlProperty,
                skosXlLabelVariable,
              ),
              ...new Model.GraphPatterns(skosXlLabelVariable),
              GraphPattern.basic(
                skosXlLabelVariable,
                skosxl.literalForm,
                BasicGraphPattern.variable(
                  `${skosXlLabelVariable.value}LiteralForm`,
                ),
              ),
            ),
          );
        }
      }
    }
  }
}
