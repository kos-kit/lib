import { noteProperties } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { GraphPattern, GraphPatternSubject } from "./GraphPattern.js";
import { labeledModelGraphPatterns } from "./labeledModelGraphPatterns.js";

export function conceptGraphPatterns({
  subject,
  variablePrefix,
}: {
  subject: GraphPatternSubject;
  variablePrefix: string;
}): readonly GraphPattern[] {
  const graphPatterns: GraphPattern[] = [];

  graphPatterns.push({
    subject,
    predicate: skos.notation,
    object: {
      termType: "Variable",
      value: `${variablePrefix}Notation`,
    },
    optional: true,
  });

  for (const noteProperty of noteProperties) {
    graphPatterns.push({
      subject,
      predicate: noteProperty.identifier,
      object: {
        plainLiteral: true,
        termType: "Variable",
        value:
          variablePrefix +
          noteProperty.name[0].toUpperCase() +
          noteProperty.name.substring(1),
      },
      optional: true,
    });
  }

  return labeledModelGraphPatterns({
    subject,
    variablePrefix,
  }).concat(graphPatterns);
}
