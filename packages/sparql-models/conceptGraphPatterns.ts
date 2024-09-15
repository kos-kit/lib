import { Note } from "@kos-kit/models";
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

  Note.Types.forEach((noteType, noteTypeI) => {
    graphPatterns.push({
      subject,
      predicate: noteType.skosProperty,
      object: {
        plainLiteral: true,
        termType: "Variable",
        value: `${variablePrefix}NoteType${noteTypeI}`,
      },
      optional: true,
    });
  });

  return labeledModelGraphPatterns({
    subject,
    variablePrefix,
  }).concat(graphPatterns);
}
