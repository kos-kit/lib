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

  graphPatterns.push(
    GraphPattern.optional(
      GraphPattern.basic(subject, skos.notation, {
        termType: "Variable",
        value: `${variablePrefix}Notation`,
      }),
    ),
  );

  Note.Types.forEach((noteType, noteTypeI) => {
    graphPatterns.push(
      GraphPattern.optional(
        GraphPattern.basic(subject, noteType.skosProperty, {
          plainLiteral: true,
          termType: "Variable",
          value: `${variablePrefix}NoteType${noteTypeI}`,
        }),
      ),
    );
  });

  return labeledModelGraphPatterns({
    subject,
    variablePrefix,
  }).concat(graphPatterns);
}
