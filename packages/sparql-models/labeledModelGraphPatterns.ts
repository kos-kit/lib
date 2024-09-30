import { Label } from "@kos-kit/models";
import { skosxl } from "@tpluscode/rdf-ns-builders";
import {
  GraphPattern,
  GraphPatternSubject,
  GraphPatternVariable,
} from "./GraphPattern.js";
import { modelGraphPatterns } from "./modelGraphPatterns.js";

export function labeledModelGraphPatterns({
  subject,
  variablePrefix,
}: {
  subject: GraphPatternSubject;
  variablePrefix: string;
}): readonly GraphPattern[] {
  const graphPatterns: GraphPattern[] = [];

  Label.Types.forEach((labelType, labelTypeI) => {
    graphPatterns.push(
      GraphPattern.optional(
        GraphPattern.basic(subject, labelType.literalProperty, {
          plainLiteral: true,
          termType: "Variable",
          value: `${variablePrefix}LabelType${labelTypeI}Literal`,
        }),
      ),
    );

    labelType.skosXlProperty.ifJust((skosXlProperty) => {
      const skosXlLabelVariable: GraphPatternVariable = {
        termType: "Variable",
        value: `${variablePrefix}LabelType${labelTypeI}Resource`,
      };
      graphPatterns.push(
        GraphPattern.optional(
          GraphPattern.group(
            GraphPattern.basic(subject, skosXlProperty, skosXlLabelVariable),
            ...modelGraphPatterns({
              subject: skosXlLabelVariable,
              variablePrefix: skosXlLabelVariable.value,
            }),
            GraphPattern.basic(skosXlLabelVariable, skosxl.literalForm, {
              termType: "Variable",
              value: `${skosXlLabelVariable.value}LiteralForm`,
            }),
          ),
        ),
      );
    });
  });

  return modelGraphPatterns({ subject, variablePrefix }).concat(graphPatterns);
}
