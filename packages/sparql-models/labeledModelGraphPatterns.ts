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
    graphPatterns.push({
      subject,
      predicate: labelType.literalProperty,
      object: {
        plainLiteral: true,
        termType: "Variable",
        value: `${variablePrefix}LabelType${labelTypeI}Literal`,
      },
      optional: true,
    });

    labelType.skosXlProperty.ifJust((skosXlProperty) => {
      const skosXlLabelVariable: GraphPatternVariable = {
        termType: "Variable",
        value: `${variablePrefix}LabelType${labelTypeI}Resource`,
      };
      graphPatterns.push({
        subject,
        predicate: skosXlProperty,
        object: skosXlLabelVariable,
        optional: true,
        subGraphPatterns: modelGraphPatterns({
          subject: skosXlLabelVariable,
          variablePrefix: skosXlLabelVariable.value,
        }).concat([
          {
            subject: skosXlLabelVariable,
            predicate: skosxl.literalForm,
            object: {
              termType: "Variable",
              value: `${skosXlLabelVariable.value}LiteralForm`,
            },
          },
        ]),
      });
    });
  });

  return modelGraphPatterns({ subject, variablePrefix }).concat(graphPatterns);
}
