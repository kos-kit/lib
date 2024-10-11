import { Note } from "@kos-kit/models";
import { GraphPattern, ResourceGraphPatterns } from "@kos-kit/sparql-builder";
import { skos } from "@tpluscode/rdf-ns-builders";
import { LabeledModel } from "./LabeledModel.js";

export namespace Concept {
  export class GraphPatterns extends ResourceGraphPatterns {
    override *[Symbol.iterator](): Iterator<GraphPattern> {
      yield* new LabeledModel.GraphPatterns(this.subject);

      yield GraphPattern.optional(
        GraphPattern.basic(
          this.subject,
          skos.notation,
          this.variable("Notation"),
        ),
      );

      for (let noteTypeI = 0; noteTypeI < Note.Types.length; noteTypeI++) {
        const noteType = Note.Types[noteTypeI];
        yield GraphPattern.optional(
          GraphPattern.basic(this.subject, noteType.skosProperty, {
            ...this.variable(`NoteType${noteTypeI}`),
            plainLiteral: true,
          }),
        );
      }
    }
  }
}
