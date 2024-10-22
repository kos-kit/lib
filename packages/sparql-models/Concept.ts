import { Note } from "@kos-kit/models";
import { GraphPattern, ResourceGraphPatterns } from "@kos-kit/sparql-builder";
import { skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";

export namespace Concept {
  export class GraphPatterns extends LabeledModel.GraphPatterns {
    constructor(subject: ResourceGraphPatterns.SubjectParameter) {
      super(subject);

      this.add(
        GraphPattern.optional(
          GraphPattern.basic(
            this.subject,
            skos.notation,
            this.variable("Notation"),
          ),
        ),
      );

      for (let noteTypeI = 0; noteTypeI < Note.Types.length; noteTypeI++) {
        const noteType = Note.Types[noteTypeI];
        this.add(
          GraphPattern.optional(
            GraphPattern.basic(this.subject, noteType.skosProperty, {
              ...this.variable(`NoteType${noteTypeI}`),
              plainLiteral: true,
            }),
          ),
        );
      }
    }
  }
}
