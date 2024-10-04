import { Note } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { GraphPattern } from "./GraphPattern.js";
import { GraphPatterns } from "./GraphPatterns.js";
import { LabeledModelGraphPatterns } from "./LabeledModelGraphPatterns.js";

export class ConceptGraphPatterns extends GraphPatterns {
  override *[Symbol.iterator](): Iterator<GraphPattern> {
    yield* new LabeledModelGraphPatterns(this.subject);

    yield GraphPattern.optional(
      GraphPattern.basic(this.subject, skos.notation, {
        termType: "Variable",
        value: `${this.variablePrefix}Notation`,
      }),
    );

    for (let noteTypeI = 0; noteTypeI < Note.Types.length; noteTypeI++) {
      const noteType = Note.Types[noteTypeI];
      yield GraphPattern.optional(
        GraphPattern.basic(this.subject, noteType.skosProperty, {
          plainLiteral: true,
          termType: "Variable",
          value: `${this.variablePrefix}NoteType${noteTypeI}`,
        }),
      );
    }
  }
}
