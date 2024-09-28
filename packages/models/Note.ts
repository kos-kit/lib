import { Literal, NamedNode } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Equatable } from "purify-ts-helpers";

export interface Note extends Equatable<Note> {
  readonly literalForm: Literal;
  readonly type: Note.Type;
}

export namespace Note {
  export interface Type extends Equatable<Type> {
    readonly skosProperty: NamedNode;
  }

  export namespace Type {
    function equals(this: Note.Type, other: Note.Type): Equatable.EqualsResult {
      return Equatable.propertyEquals(this, other, "skosProperty");
    }

    export const CHANGE_NOTE: Type = {
      equals,
      skosProperty: skos.changeNote,
    };

    export const DEFINITION: Type = {
      equals,
      skosProperty: skos.definition,
    };

    export const EDITORIAL_NOTE: Type = {
      equals,
      skosProperty: skos.editorialNote,
    };

    export const EXAMPLE: Type = {
      equals,
      skosProperty: skos.example,
    };

    export const HISTORY_NOTE: Type = {
      equals,
      skosProperty: skos.historyNote,
    };

    export const NOTE: Type = {
      equals,
      skosProperty: skos.historyNote,
    };

    export const SCOPE_NOTE: Type = {
      equals,
      skosProperty: skos.scopeNote,
    };
  }

  export const Types: readonly Type[] = [
    Type.CHANGE_NOTE,
    Type.DEFINITION,
    Type.EDITORIAL_NOTE,
    Type.EXAMPLE,
    Type.HISTORY_NOTE,
    Type.NOTE,
    Type.SCOPE_NOTE,
  ];
}
