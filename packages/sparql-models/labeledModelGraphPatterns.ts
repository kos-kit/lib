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
      graphPattern: {
        subject,
        predicate: labelType.literalProperty,
        object: {
          plainLiteral: true,
          termType: "Variable",
          value: `${variablePrefix}LabelType${labelTypeI}Literal`,
        },
        type: "Basic",
      },
      type: "Optional",
    });

    labelType.skosXlProperty.ifJust((skosXlProperty) => {
      const skosXlLabelVariable: GraphPatternVariable = {
        termType: "Variable",
        value: `${variablePrefix}LabelType${labelTypeI}Resource`,
      };
      graphPatterns.push({
        graphPattern: {
          graphPatterns: [
            {
              subject,
              predicate: skosXlProperty,
              object: skosXlLabelVariable,
              type: "Basic",
            } as GraphPattern,
          ].concat(
            modelGraphPatterns({
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
                type: "Basic",
              },
            ]),
          ),
          type: "Group",
        },
        type: "Optional",
      });
    });
  });

  return modelGraphPatterns({ subject, variablePrefix }).concat(graphPatterns);
}
