import { Label } from "@kos-kit/models";
import { skosxl } from "@tpluscode/rdf-ns-builders";
import { BasicGraphPattern, GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";
import { ModelGraphPatterns } from "./ModelGraphPatterns.js";

export class LabeledModelGraphPatterns extends GraphPatterns {
  override *[Symbol.iterator](): Iterator<GraphPattern> {
    yield* new ModelGraphPatterns(this.subject);

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
            ...new ModelGraphPatterns(skosXlLabelVariable),
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
