import { skos, skosxl } from "@tpluscode/rdf-ns-builders";
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
      value: `${variablePrefix + variableName}Resource`,
    };
    graphPatterns.push({
      subject,
      predicate: skosxlPredicate,
      object: skosxlLabelVariable,
      optional: true,
      subGraphPatterns: modelGraphPatterns({
        subject: skosxlLabelVariable,
        variablePrefix: skosxlLabelVariable.value,
      }).concat([
        {
          subject: skosxlLabelVariable,
          predicate: skosxl.literalForm,
          object: {
            termType: "Variable",
            value: `${variablePrefix + variableName}LiteralForm`,
          },
        },
      ]),
    });
  }

  return modelGraphPatterns({ subject, variablePrefix }).concat(graphPatterns);
}
